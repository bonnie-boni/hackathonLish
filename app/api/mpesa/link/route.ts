import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MpesaTransaction } from '@/lib/mongodb/models/MpesaTransaction';
import { Payment } from '@/lib/mongodb/models/Payment';
import { Receipt } from '@/lib/mongodb/models/Receipt';
import { Order as OrderModel } from '@/lib/mongodb/models/Order';
import { Profile } from '@/lib/mongodb/models/Profile';
import { renderOrderConfirmationEmail } from '@/components/email/OrderConfirmationEmail';
import { sendEmailSMTP } from '@/lib/email';

/**
 * POST /api/mpesa/link
 * Called by the client after order creation to:
 *  1. Link mpesa_transactions → order
 *  2. Create a payment record
 *  3. Create a receipt record
 *  4. Mark order COMPLETED
 *  5. Send receipt email (best-effort)
 */
export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestId, orderId } = await req.json();
    if (!checkoutRequestId || !orderId) {
      return NextResponse.json({ error: 'checkoutRequestId and orderId required' }, { status: 400 });
    }

    await connectDB();

    // 1. Link mpesa transaction to order
    await MpesaTransaction.findOneAndUpdate(
      { checkoutRequestId },
      { orderId, status: 'success' }
    );

    const tx = await MpesaTransaction.findOne({ checkoutRequestId }).lean();

    // 2. Create payment record
    let paymentId: string | null = null;
    try {
      const existing = await Payment.findOne({ orderId, provider: 'mpesa' }).lean();
      if (existing) {
        paymentId = (existing._id as any).toString();
        await Payment.findByIdAndUpdate(paymentId, { status: 'success' });
      } else {
        const newPayment = await Payment.create({
          orderId,
          provider: 'mpesa',
          providerPaymentId: (tx as any)?.mpesaReceiptNumber ?? checkoutRequestId,
          amount: (tx as any)?.amount ?? 0,
          currency: 'KES',
          status: 'success',
        });
        paymentId = newPayment._id.toString();
      }
    } catch (payErr: any) {
      console.warn('Failed to create payment record:', payErr?.message);
    }

    // 3. Create receipt record
    let receiptId: string | null = null;
    try {
      const existingReceipt = await Receipt.findOne({ orderId }).lean();
      if (!existingReceipt) {
        const newReceipt = await Receipt.create({
          orderId,
          paymentId,
          mpesaTxId: tx ? (tx._id as any).toString() : null,
          receiptNumber: (tx as any)?.mpesaReceiptNumber ?? null,
          amount: (tx as any)?.amount ?? 0,
          currency: 'KES',
          metadata: { checkoutRequestId },
        });
        receiptId = newReceipt._id.toString();
        console.log('Created receipt:', receiptId);
      } else {
        receiptId = (existingReceipt._id as any).toString();
      }
    } catch (rErr: any) {
      console.warn('Failed to create receipt:', rErr?.message);
    }

    // 4. Mark order as COMPLETED
    try {
      await OrderModel.findByIdAndUpdate(orderId, { status: 'COMPLETED' });
    } catch (oErr: any) {
      console.warn('Failed to mark order completed:', oErr?.message);
    }

    // 5. Send receipt email (best-effort)
    try {
      const orderRow = await OrderModel.findById(orderId).lean();
      console.log('[email] order found:', !!orderRow, 'userEmail:', (orderRow as any)?.userEmail);

      if (orderRow) {
        let toEmail: string | null = (orderRow as any).userEmail ?? null;
        let customerName = 'Customer';

        if ((orderRow as any).userId) {
          const profile = await Profile.findById((orderRow as any).userId).lean();
          if (profile) {
            toEmail = toEmail || (profile as any).email;
            customerName = (profile as any).name || toEmail || 'Customer';
          }
        }

        // Fallback: phone lookup
        if (!toEmail && (tx as any)?.phoneNumber) {
          try {
            const phoneProfile = await Profile.findOne({ phone: (tx as any).phoneNumber }).lean();
            if (phoneProfile) {
              toEmail = (phoneProfile as any).email;
              customerName = (phoneProfile as any).name || toEmail || 'Customer';
            }
          } catch { /* no profile */ }
        }

        // Last resort: x-user-email header
        if (!toEmail) {
          const emailHeader = req.headers.get('x-user-email');
          if (emailHeader) {
            toEmail = emailHeader;
            customerName = customerName === 'Customer' ? emailHeader.split('@')[0] : customerName;
          }
        }

        if (toEmail) {
          console.log('[email] Sending receipt to:', toEmail, '| SMTP_HOST:', !!process.env.SMTP_HOST);
          const normalizedOrder = {
            id: (orderRow._id as any).toString(),
            order_number: (orderRow as any).orderNumber,
            date: (orderRow as any).date,
            items: (orderRow as any).items ?? [],
            subtotal: (orderRow as any).subtotal,
            shipping: (orderRow as any).shipping,
            tax: (orderRow as any).tax,
            total: (orderRow as any).total,
          };
          const subject = `Your ModernShop receipt — Order #${(orderRow as any).orderNumber ?? ''}`;
          const smtpHost = process.env.SMTP_HOST;

          if (smtpHost) {
            const html = renderOrderConfirmationEmail(normalizedOrder, customerName);
            await sendEmailSMTP({ to: toEmail, subject, html });
            console.log('Receipt email sent to', toEmail);
          } else {
            const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
            const FROM_EMAIL = process.env.RECEIPT_FROM_EMAIL;
            if (SENDGRID_KEY && FROM_EMAIL) {
              const html = renderOrderConfirmationEmail(normalizedOrder, customerName);
              await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${SENDGRID_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  personalizations: [{ to: [{ email: toEmail }] }],
                  from: { email: FROM_EMAIL, name: 'ModernShop' },
                  subject,
                  content: [{ type: 'text/html', value: html }],
                }),
              });
              console.log('Receipt email sent via SendGrid to', toEmail);
            } else {
              console.warn('No email provider configured. Receipt email not sent.');
            }
          }
        } else {
          console.warn('No user email found for order; receipt email not sent.');
        }
      }
    } catch (emailErr: any) {
      console.error('Failed to send receipt email:', emailErr?.message, emailErr?.stack);
    }

    return NextResponse.json({ ok: true, paymentId, receiptId });
  } catch (err: any) {
    console.error('POST /api/mpesa/link error:', err);
    return NextResponse.json({ error: err.message || 'Link failed' }, { status: 500 });
  }
}
