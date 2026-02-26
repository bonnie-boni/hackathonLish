'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import OrderSummary from '@/components/checkout/OrderSummary';
import MpesaPaymentForm from '@/components/checkout/MpesaPaymentForm';
import { useCartStore } from '@/lib/cart-store';
import { calculateTax, generateOrderId } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderId] = useState(generateOrderId());
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Use KSh 1 per item for checkout totals to match OrderSummary
  const PRICE_PER_ITEM = 1;
  const subtotal = items.reduce((acc, i) => acc + PRICE_PER_ITEM * i.quantity, 0);
  const shipping = subtotal >= 400 ? 0 : 5.99;
  const tax = calculateTax(subtotal);
  const total = subtotal + shipping + tax;

  const handleSuccess = () => {
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => router.push('/receipts'), 2000);
  };

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="success-page">
          <div className="success-card">
            <CheckCircle size={56} className="success-icon" />
            <h2>Order Placed!</h2>
            <p>Redirecting to your receipts...</p>
          </div>
          <style jsx>{`
            .success-page {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 60vh;
            }
            .success-card {
              text-align: center;
              background: white;
              border-radius: 20px;
              padding: 3rem;
              border: 1px solid #f0eeff;
            }
            .success-icon { color: #7000ff; margin-bottom: 1rem; }
            h2 { font-size: 1.5rem; font-weight: 800; color: #1a0533; margin: 0 0 0.5rem; }
            p { color: #7a6898; }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="main">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Payment */}
          <div className="payment-section">
            <h2 className="section-title">Payment Method</h2>
            <MpesaPaymentForm
              amount={Math.round(total)}
              orderId={orderId}
              onSuccess={handleSuccess}
            />
          </div>

          {/* Order Summary */}
          <OrderSummary
            items={items}
            onPlaceOrder={() => {}}
            loading={false}
          />
        </div>
      </main>

      <style jsx>{`
        .main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a0533;
          margin: 0 0 1.75rem;
        }
        .checkout-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .payment-section {
          flex: 1;
          min-width: 280px;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 1rem;
        }
      `}</style>
    </>
  );
}
