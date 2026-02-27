// M-Pesa Daraja API Integration
// Uses Safaricom Daraja API for STK Push

const DARAJA_BASE_URL = process.env.DARAJA_BASE_URL || 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const BUSINESS_SHORT_CODE = process.env.MPESA_SHORTCODE || '174379';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback';

export async function getMpesaAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const response = await fetch(
    `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get M-Pesa access token');
  }

  const data = await response.json();
  return data.access_token;
}

export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function generatePassword(timestamp: string): string {
  const raw = `${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`;
  return Buffer.from(raw).toString('base64');
}

export async function initiateStkPush({
  phoneNumber,
  amount,
  orderId,
}: {
  phoneNumber: string;
  amount: number;
  orderId: string;
}) {
  const accessToken = await getMpesaAccessToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);

  // Format phone number: remove leading 0 or +254 and ensure starts with 254
  let formattedPhone = phoneNumber
    .replace(/\s+/g, '')
    .replace(/^\+/, '')
    .replace(/^0/, '254');
  if (!formattedPhone.startsWith('254')) {
    formattedPhone = `254${formattedPhone}`;
  }

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: formattedPhone,
    PartyB: BUSINESS_SHORT_CODE,
    PhoneNumber: formattedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: `ModernShop-${orderId}`,
    TransactionDesc: `Payment for Order #${orderId}`,
  };

  const response = await fetch(
    `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || 'STK Push failed');
  }

  return response.json();
}

export async function queryStkPushStatus(checkoutRequestId: string) {
  const accessToken = await getMpesaAccessToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const response = await fetch(
    `${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
}
