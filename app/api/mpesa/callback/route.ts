import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

// This endpoint receives the M-Pesa callback after payment completion
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();

  try {
    const body = await req.json();
    const { Body } = body;

    // Log the raw webhook
    await supabase.from('webhooks_log').insert({
      provider: 'mpesa',
      event_type: 'stk_callback',
      payload: body,
    });

    const { stkCallback } = Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    console.log('M-Pesa Callback received:', {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    });

    if (ResultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const amount = callbackMetadata.find((i: any) => i.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = callbackMetadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phoneNumber = callbackMetadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;

      console.log('Payment successful:', { amount, mpesaReceiptNumber, phoneNumber });

      // Update mpesa_transactions
      await supabase
        .from('mpesa_transactions')
        .update({
          result_code: ResultCode,
          result_desc: ResultDesc,
          mpesa_receipt_number: mpesaReceiptNumber ?? null,
          callback_payload: body,
          status: 'success',
        })
        .eq('checkout_request_id', CheckoutRequestID);

      // Update linked payment status
      const { data: tx } = await supabase
        .from('mpesa_transactions')
        .select('order_id')
        .eq('checkout_request_id', CheckoutRequestID)
        .single();

      if (tx?.order_id) {
        await supabase
          .from('payments')
          .update({ status: 'success' })
          .eq('order_id', tx.order_id);

        await supabase
          .from('orders')
          .update({ status: 'COMPLETED' })
          .eq('id', tx.order_id);
      }
    } else {
      // Payment failed
      console.log('Payment failed:', ResultDesc);
      await supabase
        .from('mpesa_transactions')
        .update({
          result_code: ResultCode,
          result_desc: ResultDesc,
          callback_payload: body,
          status: 'failed',
        })
        .eq('checkout_request_id', CheckoutRequestID);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' });
  }
}
