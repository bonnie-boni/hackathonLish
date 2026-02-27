import { NextRequest, NextResponse } from 'next/server';
import { initiateStkPush } from '@/lib/mpesa';
import { connectDB } from '@/lib/mongodb/connection';
import { MpesaTransaction } from '@/lib/mongodb/models/MpesaTransaction';

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

    // Persist the STK push request in MongoDB
    try {
      await connectDB();
      await MpesaTransaction.create({
        orderId: null,
        checkoutRequestId: result.CheckoutRequestID ?? null,
        merchantRequestId: result.MerchantRequestID ?? null,
        phoneNumber,
        amount,
        status: 'pending',
      });
    } catch (dbErr: any) {
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
