import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MpesaTransaction } from '@/lib/mongodb/models/MpesaTransaction';
import { Payment } from '@/lib/mongodb/models/Payment';
import { Receipt } from '@/lib/mongodb/models/Receipt';
import { Order as OrderModel } from '@/lib/mongodb/models/Order';
import { Profile } from '@/lib/mongodb/models/Profile';
import { WebhookLog } from '@/lib/mongodb/models/WebhookLog';
import { renderOrderConfirmationEmail } from '@/components/email/OrderConfirmationEmail';
import { sendEmailSMTP } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { Body } = body;

    // Log the raw webhook
    await WebhookLog.create({
      provider: 'mpesa',
      eventType: 'stk_callback',
      payload: body,
    });

    const { stkCallback } = Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    console.log('M-Pesa Callback received:', { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc });

    if (ResultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const amount = callbackMetadata.find((i: any) => i.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = callbackMetadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phoneNumber = callbackMetadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;

      console.log('Payment successful:', { amount, mpesaReceiptNumber, phoneNumber });

      await MpesaTransaction.findOneAndUpdate(
        { checkoutRequestId: CheckoutRequestID },
        {
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          mpesaReceiptNumber: mpesaReceiptNumber ?? null,
          callbackPayload: body,
          status: 'success',
        }
      );

      const tx = await MpesaTransaction.findOne({ checkoutRequestId: CheckoutRequestID }).lean();

      if (tx?.orderId) {
        try {
          const existingPayment = await Payment.findOne({ orderId: tx.orderId, provider: 'mpesa' }).lean();
          let paymentId: string | null = existingPayment ? (existingPayment._id as any).toString() : null;

          if (!paymentId) {
            const newPayment = await Payment.create({
              orderId: tx.orderId,
              provider: 'mpesa',
              providerPaymentId: mpesaReceiptNumber ?? null,
              amount: amount ?? tx.amount ?? null,
              currency: 'KES',
              status: 'success',
              rawResponse: body,
            });
            paymentId = newPayment._id.toString();
          } else {
            await Payment.findByIdAndUpdate(paymentId, { status: 'success', rawResponse: body });
          }

          // Create receipt
          try {
            const receipt = await Receipt.create({
              orderId: tx.orderId,
              paymentId,
              mpesaTxId: (tx._id as any).toString(),
              receiptNumber: mpesaReceiptNumber ?? null,
              amount: amount ?? tx.amount ?? null,
              currency: 'KES',
              metadata: { callback: body },
            });
            console.log('Created receipt', receipt._id.toString());

            // Send receipt email
            try {
              const orderRow = await OrderModel.findById(tx.orderId).lean();
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

                if (toEmail) {
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
                  const smtpHost = process.env.SMTP_HOST;
                  if (smtpHost) {
                    const html = renderOrderConfirmationEmail(normalizedOrder, customerName);
                    await sendEmailSMTP({
                      to: toEmail,
                      subject: `Your ModernShop receipt — Order #${(orderRow as any).orderNumber ?? ''}`,
                      html,
                    });
                    console.log('Receipt email sent to', toEmail);
                  }
                }
              }
            } catch (emailErr: any) {
              console.warn('Failed sending receipt email:', emailErr?.message);
            }
          } catch (rErr: any) {
            console.warn('Failed to create receipt:', rErr?.message);
          }

          await OrderModel.findByIdAndUpdate(tx.orderId, { status: 'COMPLETED' });
        } catch (pErr: any) {
          console.warn('Failed to persist payment/receipt:', pErr?.message);
        }
      }
    } else {
      console.log('Payment failed:', ResultDesc);
      await MpesaTransaction.findOneAndUpdate(
        { checkoutRequestId: CheckoutRequestID },
        {
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          callbackPayload: body,
          status: 'failed',
        }
      );
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error: any) {
    console.error('Callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' });
  }
}
