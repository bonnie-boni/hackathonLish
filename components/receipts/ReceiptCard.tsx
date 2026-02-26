'use client';

import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ReceiptCardProps {
  order: Order;
  onViewReceipt: (order: Order) => void;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  COMPLETED: { bg: '#e8fff4', color: '#00b894' },
  PROCESSING: { bg: '#e8f4ff', color: '#0984e3' },
  REFUNDED: { bg: '#fff5f0', color: '#e17055' },
  CANCELLED: { bg: '#ffeef0', color: '#d63031' },
};

export default function ReceiptCard({ order, onViewReceipt }: ReceiptCardProps) {
  const { bg, color } = statusColors[order.status] || statusColors.COMPLETED;

  return (
    <div className="receipt-card">
      <div className="receipt-thumb">
        <img src={order.thumbnail} alt={`Order ${order.orderNumber}`} className="thumb-img" />
      </div>

      <div className="receipt-info">
        <div className="receipt-top">
          <span className="receipt-number">Order #{order.orderNumber}</span>
          <span className="status-badge" style={{ background: bg, color }}>
            {order.status}
          </span>
        </div>
        <span className="receipt-date">{order.date} • {order.time}</span>
        <span className="receipt-total">{formatCurrency(order.total)}</span>
      </div>

      <div className="receipt-actions">
        <button className="view-btn" onClick={() => onViewReceipt(order)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View E-Receipt
        </button>
        <button className="more-btn">•••</button>
      </div>

      <style jsx>{`
        .receipt-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #f0eeff;
          transition: box-shadow 0.2s;
        }
        .receipt-card:hover {
          box-shadow: 0 4px 20px rgba(112, 0, 255, 0.08);
        }
        .receipt-thumb {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f8f5ff;
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .receipt-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .receipt-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .receipt-number {
          font-size: 1rem;
          font-weight: 700;
          color: #1a0533;
        }
        .status-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }
        .receipt-date {
          font-size: 0.8rem;
          color: #9b8cc4;
        }
        .receipt-total {
          font-size: 1.05rem;
          font-weight: 700;
          color: #7000ff;
          margin-top: 2px;
        }
        .receipt-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          background: #f0e8ff;
          color: #7000ff;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .view-btn:hover { background: #e0d0ff; }
        .more-btn {
          padding: 0.55rem 0.6rem;
          background: white;
          border: 1px solid #e8e0ff;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #9b8cc4;
          cursor: pointer;
          transition: background 0.2s;
          line-height: 1;
        }
        .more-btn:hover { background: #f5f0ff; }
      `}</style>
    </div>
  );
}
