import { NextResponse } from 'next/server';

// Dev-only endpoint to inspect the Daraja token endpoint response.
// Returns raw status and body to help debug WAF/DNS/network issues.
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const DARAJA_BASE_URL = process.env.DARAJA_BASE_URL || 'https://sandbox.safaricom.co.ke';
  const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
  const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json({ error: 'Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET in .env.local' }, { status: 400 });
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const url = `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  try {
    const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' });
    const text = await res.text();
    return NextResponse.json({ url, status: res.status, statusText: res.statusText, body: text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 502 });
  }
}
