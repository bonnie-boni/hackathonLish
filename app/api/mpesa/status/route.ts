import { NextRequest, NextResponse } from 'next/server';
import { queryStkPushStatus } from '@/lib/mpesa';
import { connectDB } from '@/lib/mongodb/connection';
import { MpesaTransaction } from '@/lib/mongodb/models/MpesaTransaction';

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestId } = await req.json();

    if (!checkoutRequestId) {
      return NextResponse.json({ error: 'Missing checkoutRequestId' }, { status: 400 });
    }

    let result: any;
    try {
      result = await queryStkPushStatus(checkoutRequestId);
    } catch (queryErr: any) {
      console.warn('queryStkPushStatus failed:', queryErr?.message?.slice(0, 300));
      try {
        await connectDB();
        const tx = await MpesaTransaction.findOne({ checkoutRequestId }).lean();
        if (tx && (tx as any).status === 'success') {
          console.log('Daraja query failed but DB shows success (callback arrived)');
          return NextResponse.json({
            ResultCode: '0',
            ResultDesc: 'The service request is processed successfully.',
          });
        }
      } catch { /* DB lookup failed too */ }

      return NextResponse.json({
        ResultCode: 'pending',
        ResultDesc: 'Payment status pending — waiting for M-Pesa confirmation.',
      });
    }

    // If Daraja indicates success, persist (best-effort)
    try {
      const resultCode = result?.ResultCode ?? result?.Result?.ResultCode ?? null;
      if (String(resultCode) === '0') {
        try {
          await connectDB();
          await MpesaTransaction.findOneAndUpdate(
            { checkoutRequestId },
            { status: 'success', callbackPayload: result }
          );
        } catch (dbErr) {
          console.warn('Could not persist mpesa status:', dbErr);
        }
      }
    } catch (e) {
      console.warn('Error while attempting to persist mpesa status:', e);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('POST /api/mpesa/status unhandled:', error);
    return NextResponse.json({ error: error.message || 'Status query failed' }, { status: 500 });
  }
}
