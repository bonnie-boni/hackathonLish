'use client';

import { X, Download, CheckCircle } from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface EReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

const itemIcons: Record<string, JSX.Element> = {
  headphones: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 18v-6a9 9 0 0118 0v6"/>
      <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
    </svg>
  ),
  cable: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h8M8 12h8M8 18h8"/>
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  ),
};

export default function EReceiptModal({ order, onClose }: EReceiptModalProps) {
  if (!order) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Purple Header */}
        <div className="receipt-header">
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
          <div className="check-circle">
            <CheckCircle size={28} />
          </div>
          <h2 className="header-title">Thank You for Your Order</h2>
          <p className="header-sub">We&apos;ve received your order and are processing it now.</p>
        </div>

        {/* Order Meta */}
        <div className="order-meta">
          <div>
            <span className="meta-label">ORDER ID</span>
            <span className="meta-value">#{order.id}</span>
          </div>
          <div className="meta-right">
            <span className="meta-label">ORDER DATE</span>
            <span className="meta-value">{order.date}</span>
          </div>
        </div>

        <div className="divider" />

        {/* Items */}
        <div className="items-section">
          <h3 className="items-title">Order Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-icon">
                {itemIcons[item.icon] || itemIcons.default}
              </div>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">Qty: {item.quantity}</span>
              </div>
              <span className="item-price">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="totals-section">
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Shipping</span>
            <span className="free">FREE</span>
          </div>
          <div className="total-row">
            <span>Tax (8%)</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="grand-total">
            <span>Total</span>
            <span className="grand-amount">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Download */}
        <button className="download-btn">
          <Download size={16} />
          Download Receipt
        </button>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 0, 30, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .receipt-header {
          background: #7000ff;
          color: white;
          padding: 2rem 1.5rem 1.5rem;
          text-align: center;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }
        .check-circle {
          width: 56px;
          height: 56px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
        }
        .header-title {
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0 0 0.375rem;
        }
        .header-sub {
          font-size: 0.85rem;
          opacity: 0.85;
          margin: 0;
        }
        .order-meta {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
        }
        .meta-right { text-align: right; }
        .meta-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #9b8cc4;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
        }
        .meta-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a0533;
        }
        .divider {
          height: 1px;
          background: #f0eeff;
          margin: 0 1.5rem;
        }
        .items-section {
          padding: 1rem 1.5rem;
        }
        .items-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 0.875rem;
        }
        .item-row {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin-bottom: 0.875rem;
        }
        .item-icon {
          width: 40px;
          height: 40px;
          background: #f0e8ff;
          color: #7000ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a0533;
        }
        .item-qty {
          font-size: 0.75rem;
          color: #9b8cc4;
          margin-top: 2px;
        }
        .item-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a0533;
        }
        .totals-section {
          background: #fdfaff;
          margin: 0 1.5rem;
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #f0eeff;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #7a6898;
          margin-bottom: 0.4rem;
        }
        .free { color: #00b894; font-weight: 600; }
        .grand-total {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 700;
          color: #1a0533;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e8e0ff;
        }
        .grand-amount { color: #7000ff; }
        .download-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: calc(100% - 3rem);
          margin: 1rem 1.5rem 1.5rem;
          padding: 0.75rem;
          background: white;
          border: 1px solid #e8e0ff;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #7000ff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .download-btn:hover { background: #f5f0ff; }
      `}</style>
    </div>
  );
}
