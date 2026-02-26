'use client';

import { CartItem } from '@/types';
import { formatCurrency, calculateTax } from '@/lib/utils';

interface OrderSummaryProps {
  items: CartItem[];
  onPlaceOrder: () => void;
  loading?: boolean;
}

export default function OrderSummary({ items, onPlaceOrder, loading }: OrderSummaryProps) {
  // All products are priced at KSh 1 each in the Order Summary
  const PRICE_PER_ITEM = 1;
  const subtotal = items.reduce((acc, i) => acc + PRICE_PER_ITEM * i.quantity, 0);
  const shipping = subtotal >= 400 ? 0 : 5.99;
  const tax = calculateTax(subtotal);
  const total = subtotal + shipping + tax;

  return (
    <div className="summary">
      <h2 className="summary-title">Order Summary</h2>

      <div className="items-list">
        {items.map((item) => (
          <div key={item.product.id} className="item-row">
            <div className="item-image-wrap">
              <img src={item.product.image} alt={item.product.name} className="item-image" />
            </div>
            <div className="item-info">
              <span className="item-name">{item.product.name}</span>
              <span className="item-qty">Qty: {item.quantity}</span>
            </div>
              <span className="item-price">
                {formatCurrency(PRICE_PER_ITEM * item.quantity)}
              </span>
          </div>
        ))}
      </div>

      <div className="summary-divider" />

      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span className="free">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
      </div>
      <div className="summary-row">
        <span>Tax (8%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>

      <div className="summary-divider" />

      <div className="total-row">
        <span>Total</span>
        <span className="total-amount">{formatCurrency(total)}</span>
      </div>

      <button
        className="place-order-btn"
        onClick={onPlaceOrder}
        disabled={loading || items.length === 0}
      >
        {loading ? 'Processing...' : 'Place Order →'}
      </button>

      <p className="tos-note">
        By placing your order, you agree to our{' '}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </p>

      <style jsx>{`
        .summary {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid #f0eeff;
          width: 100%;
          max-width: 360px;
        }
        .summary-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 1.25rem;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-bottom: 1rem;
        }
        .item-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .item-image-wrap {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          overflow: hidden;
          background: #f5f0ff;
          flex-shrink: 0;
        }
        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a0533;
          line-height: 1.3;
        }
        .item-qty {
          font-size: 0.78rem;
          color: #7000ff;
          margin-top: 2px;
        }
        .item-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a0533;
        }
        .summary-divider {
          height: 1px;
          background: #f0eeff;
          margin: 0.875rem 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #7a6898;
          margin-bottom: 0.4rem;
        }
        .free { color: #00b894; font-weight: 600; }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 700;
          color: #1a0533;
          margin-top: 0.25rem;
        }
        .total-amount { color: #7000ff; }
        .place-order-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.875rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .place-order-btn:hover:not(:disabled) { background: #5900cc; }
        .place-order-btn:active:not(:disabled) { transform: scale(0.99); }
        .place-order-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tos-note {
          text-align: center;
          font-size: 0.74rem;
          color: #b0a0d0;
          margin: 0.75rem 0 0;
        }
        .tos-note a {
          color: #7000ff;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
