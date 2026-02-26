'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ReceiptCard from '@/components/receipts/ReceiptCard';
import EReceiptModal from '@/components/receipts/EReceiptModal';
import { mockOrders } from '@/data/orders';
import { Order } from '@/types';

export default function ReceiptsPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <>
      <Navbar />
      <main className="main">
        <div className="page-header">
          <h1 className="page-title">Your Receipts</h1>
          <p className="page-sub">View and download your order history</p>
        </div>

        <div className="orders-list">
          {mockOrders.map((order) => (
            <ReceiptCard
              key={order.id}
              order={order}
              onViewReceipt={setSelectedOrder}
            />
          ))}
        </div>
      </main>

      <EReceiptModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <style jsx>{`
        .main {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .page-header {
          margin-bottom: 1.75rem;
        }
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a0533;
          margin: 0 0 0.25rem;
        }
        .page-sub {
          color: #7a6898;
          font-size: 0.9rem;
          margin: 0;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
      `}</style>
    </>
  );
}
