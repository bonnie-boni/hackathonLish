// M-Pesa Daraja API Integration
// Uses Safaricom Daraja API for STK Push

const DARAJA_BASE_URL = process.env.DARAJA_BASE_URL || 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const BUSINESS_SHORT_CODE = process.env.MPESA_SHORTCODE || '174379';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback';

// In-memory cache for M-Pesa access token to avoid frequent token requests
let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiry = 0; // epoch ms

export async function getMpesaAccessToken(): Promise<string> {
  // Dev mock: return a fake token when MPESA_MOCK is enabled to avoid hitting Daraja
  if (process.env.MPESA_MOCK === 'true') {
    return 'mock-access-token';
  }
  // Return cached token if still valid
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiry) {
    return cachedAccessToken;
  }
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET env vars');
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const url = `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });

  if (!response.ok) {
    const text = await safeReadResponseText(response);
    throw new Error(`Failed to get M-Pesa access token: ${response.status} ${response.statusText} - ${truncate(text, 1000)}`);
  }

  const data = await safeParseJson(response);
  // Cache token with expiry (daraja usually returns expires_in in seconds)
  try {
    const expiresIn = Number(data?.expires_in) || 3500;
    cachedAccessToken = data?.access_token;
    cachedAccessTokenExpiry = Date.now() + Math.max(60, expiresIn - 60) * 1000; // subtract safety margin
  } catch (e) {
    // ignore cache if parsing fails
  }
  return data?.access_token;
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
  // If in dev mock mode, simulate a successful STK push initiation
  if (process.env.MPESA_MOCK === 'true') {
    const mockCheckout = `MOCK-CHECKOUT-${Date.now()}`;
    return {
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CheckoutRequestID: mockCheckout,
      MerchantRequestID: `MOCK-MR-${Date.now()}`,
    } as any;
  }

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
    const text = await safeReadResponseText(response);
    // Try to parse JSON for an M-Pesa error message, otherwise include raw text
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {}
    const msg = parsed?.errorMessage || parsed?.error || text || 'STK Push failed';
    throw new Error(`STK Push failed: ${response.status} ${response.statusText} - ${truncate(msg, 1000)}`);
  }

  return safeParseJson(response);
}

export async function queryStkPushStatus(checkoutRequestId: string) {
  // Dev mock: immediately return success for mocked checkout requests
  if (process.env.MPESA_MOCK === 'true') {
    return {
      ResultCode: '0',
      ResultDesc: 'The service request is processed successfully.',
      CheckoutRequestID: checkoutRequestId,
    };
  }

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
  if (!response.ok) {
    const text = await safeReadResponseText(response);
    throw new Error(`STK status query failed: ${response.status} ${response.statusText} - ${truncate(text, 1000)}`);
  }

  return safeParseJson(response);
}

async function safeParseJson(res: Response) {
  // Read the body as text first so it's not consumed twice
  const text = await safeReadResponseText(res);
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse JSON response from M-Pesa: ' + truncate(text, 2000));
  }
}

async function safeReadResponseText(res: Response) {
  try {
    return await res.text();
  } catch (e: any) {
    return String(e?.message || e || '');
  }
}

function truncate(s: string, n = 500) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n) + '...' : s;
}
