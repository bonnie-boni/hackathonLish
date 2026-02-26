import { NextRequest, NextResponse } from 'next/server';

// This endpoint receives the M-Pesa callback after payment completion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Body } = body;

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

      // TODO: Update order status in database
      // await updateOrderStatus(CheckoutRequestID, 'PAID', mpesaReceiptNumber);
    } else {
      // Payment failed
      console.log('Payment failed:', ResultDesc);
      // TODO: Update order status to failed
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' });
  }
}
