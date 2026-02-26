'use client';

import { useState } from 'react';
import { Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

interface MpesaPaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

export default function MpesaPaymentForm({ amount, orderId, onSuccess }: MpesaPaymentFormProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!phone || phone.length < 9) {
      setStatus('error');
      setMessage('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setStatus('pending');
    setMessage('Sending STK push to your phone...');

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, amount, orderId }),
      });

      const data = await res.json();

      if (data.ResponseCode === '0') {
        setStatus('pending');
        setMessage('Check your phone and enter your M-Pesa PIN to complete payment.');
        // Poll for status
        pollStatus(data.CheckoutRequestID);
      } else {
        throw new Error(data.errorMessage || 'Payment initiation failed');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const pollStatus = async (checkoutRequestId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 12) {
        clearInterval(interval);
        setStatus('error');
        setMessage('Payment timed out. Please try again.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/mpesa/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutRequestId }),
        });
        const data = await res.json();

        if (data.ResultCode === '0') {
          clearInterval(interval);
          setStatus('success');
          setMessage('Payment successful!');
          setLoading(false);
          setTimeout(onSuccess, 1200);
        } else if (data.ResultCode && data.ResultCode !== '0') {
          clearInterval(interval);
          setStatus('error');
          setMessage(data.ResultDesc || 'Payment was cancelled.');
          setLoading(false);
        }
      } catch { /* keep polling */ }
    }, 5000);
  };

  return (
    <div className="mpesa-form">
      <div className="mpesa-header">
        <div className="mpesa-icon">
          <Smartphone size={24} />
        </div>
        <div>
          <h3 className="mpesa-title">Pay with M-Pesa</h3>
          <p className="mpesa-subtitle">Enter your Safaricom number to receive STK push</p>
        </div>
      </div>

      <div className="phone-field">
        <label className="field-label">Phone Number</label>
        <div className="phone-input-wrap">
          <span className="phone-prefix">+254</span>
          <input
            type="tel"
            placeholder="712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="phone-input"
            maxLength={10}
            disabled={loading}
          />
        </div>
      </div>

      {status !== 'idle' && (
        <div className={`status-box ${status}`}>
          {status === 'success' && <CheckCircle size={16} />}
          {status === 'error' && <AlertCircle size={16} />}
          {status === 'pending' && <div className="spinner" />}
          <span>{message}</span>
        </div>
      )}

      <button
        className="pay-btn"
        onClick={handleSubmit}
        disabled={loading || status === 'success'}
      >
        {loading ? 'Processing...' : `Pay KES ${amount.toLocaleString()}`}
      </button>

      <style jsx>{`
        .mpesa-form {
          background: #fdfaff;
          border: 1px solid #e8e0ff;
          border-radius: 16px;
          padding: 1.25rem;
        }
        .mpesa-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .mpesa-icon {
          width: 48px;
          height: 48px;
          background: #00b894;
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mpesa-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 2px;
        }
        .mpesa-subtitle {
          font-size: 0.78rem;
          color: #7a6898;
          margin: 0;
        }
        .field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4a3870;
          margin-bottom: 0.5rem;
        }
        .phone-input-wrap {
          display: flex;
          border: 1px solid #e8e0ff;
          border-radius: 10px;
          overflow: hidden;
          background: white;
        }
        .phone-prefix {
          padding: 0.6rem 0.875rem;
          background: #f0e8ff;
          color: #7000ff;
          font-weight: 600;
          font-size: 0.88rem;
          border-right: 1px solid #e8e0ff;
        }
        .phone-input {
          flex: 1;
          padding: 0.6rem 0.875rem;
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: #1a0533;
        }
        .status-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 10px;
          font-size: 0.83rem;
          margin: 0.875rem 0;
        }
        .status-box.pending {
          background: #fff9e6;
          color: #d4a017;
          border: 1px solid #ffe8a0;
        }
        .status-box.success {
          background: #e8fff4;
          color: #00b894;
          border: 1px solid #b2efd8;
        }
        .status-box.error {
          background: #fff5f5;
          color: #e17055;
          border: 1px solid #ffc5b8;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .pay-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #00b894;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pay-btn:hover:not(:disabled) { background: #00997c; }
        .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
