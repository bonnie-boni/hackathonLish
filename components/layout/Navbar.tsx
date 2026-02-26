'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Users } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { mockCurrentUser } from '@/data/users';

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems)();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/shop" className="navbar-logo">
          <span className="navbar-logo-icon">
            <ShoppingCart size={18} />
          </span>
          <span className="navbar-logo-text">ModernShop</span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="navbar-search-input"
          />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Link href="/collaborative-shop" className="navbar-link">
            Collaborative Shop
          </Link>
          <Link href="/receipts" className="navbar-link">
            Receipts
          </Link>

          <Link href="/checkout" className="navbar-cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="navbar-cart-badge">{totalItems}</span>
            )}
          </Link>

          <div className="navbar-avatar">
            {mockCurrentUser.initials}
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #fff;
          border-bottom: 1px solid #f0eeff;
          box-shadow: 0 1px 12px rgba(112, 0, 255, 0.06);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1a0533;
        }
        .navbar-logo-icon {
          width: 36px;
          height: 36px;
          background: #7000ff;
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .navbar-search {
          flex: 1;
          max-width: 480px;
          position: relative;
        }
        .navbar-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9b8cc4;
        }
        .navbar-search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          background: #f5f0ff;
          border: 1px solid #e8e0ff;
          border-radius: 999px;
          font-size: 0.9rem;
          color: #1a0533;
          outline: none;
          transition: border-color 0.2s;
        }
        .navbar-search-input:focus {
          border-color: #7000ff;
        }
        .navbar-search-input::placeholder {
          color: #b0a0d0;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-left: auto;
        }
        .navbar-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a3870;
          text-decoration: none;
          transition: color 0.2s;
        }
        .navbar-link:hover {
          color: #7000ff;
        }
        .navbar-cart {
          position: relative;
          color: #4a3870;
          display: flex;
          align-items: center;
          padding: 0.4rem;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .navbar-cart:hover {
          background: #f5f0ff;
        }
        .navbar-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #7000ff;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .navbar-avatar {
          width: 36px;
          height: 36px;
          background: #e8d8ff;
          color: #7000ff;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </nav>
  );
}
