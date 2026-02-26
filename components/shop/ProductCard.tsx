'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const badgeColors: Record<string, string> = {
    NEW: '#00b894',
    POPULAR: '#7000ff',
    'LOW STOCK': '#e17055',
    SALE: '#d63031',
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.badge && (
          <span
            className="product-badge"
            style={{ background: badgeColors[product.badge] }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="product-body">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">{formatCurrency(product.price)}</span>
        </div>
        <p className="product-desc">{product.description}</p>

        <button
          className="product-btn"
          onClick={() => addItem(product)}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0eeff;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .product-card:hover {
          box-shadow: 0 8px 32px rgba(112, 0, 255, 0.12);
          transform: translateY(-2px);
        }
        .product-image-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: #f8f5ff;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .product-card:hover .product-image {
          transform: scale(1.04);
        }
        .product-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          color: white;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .product-body {
          padding: 1rem;
        }
        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }
        .product-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a0533;
          margin: 0;
          line-height: 1.3;
        }
        .product-price {
          font-size: 0.95rem;
          font-weight: 700;
          color: #7000ff;
          white-space: nowrap;
        }
        .product-desc {
          font-size: 0.8rem;
          color: #7a6898;
          margin: 0 0 0.75rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.55rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .product-btn:hover {
          background: #5900cc;
        }
        .product-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
