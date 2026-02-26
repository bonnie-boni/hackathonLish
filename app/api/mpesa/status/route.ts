import { NextRequest, NextResponse } from 'next/server';
import { queryStkPushStatus } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestId } = await req.json();

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing checkoutRequestId' },
        { status: 400 }
      );
    }

    const result = await queryStkPushStatus(checkoutRequestId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Status query failed' },
      { status: 500 }
    );
  }
}
