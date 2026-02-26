import { NextRequest, NextResponse } from 'next/server';
import { initiateStkPush } from '@/lib/mpesa';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, orderId } = await req.json();

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await initiateStkPush({ phoneNumber, amount, orderId });

    // Persist the STK push request in Supabase
    try {
      const supabase = createServiceClient();
      await supabase.from('mpesa_transactions').insert({
        order_id: null, // will be linked when we have an order UUID
        checkout_request_id: result.CheckoutRequestID ?? null,
        merchant_request_id: result.MerchantRequestID ?? null,
        phone_number: phoneNumber,
        amount,
        status: 'pending',
      });
    } catch (dbErr) {
      console.error('Failed to save mpesa transaction:', dbErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('M-Pesa STK Push error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
