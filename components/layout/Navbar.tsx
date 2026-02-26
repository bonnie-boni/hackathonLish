'use client';

import Link from 'next/link';
import { ShoppingCart, Search } from 'lucide-react';
import { openInviteCollaborators } from '@/components/shop/inviteCollaborators';
import { mockCollaborativeShop } from '@/data/users';
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
          <Link
            href="/collaborative-shop"
            className="navbar-link"
            onClick={() => openInviteCollaborators(mockCollaborativeShop.name)}
          >
            Collaborative Shop
          </Link>
          <Link href="/receipts" className="navbar-link">
            Receipts
          </Link>

          <Link href="/checkout" className="navbar-cart">
            <span className="navbar-cart-icon" aria-hidden="true">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="navbar-cart-badge">{totalItems}</span>
              )}
            </span>
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
          background: #fbf7ff; /* subtle purple tint like the design */
          border-bottom: 1px solid #f0eeff;
          box-shadow: 0 1px 18px rgba(112, 0, 255, 0.06);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 72px; /* slightly taller header */
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
          width: 40px;
          height: 40px;
          background: #7000ff;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(112, 0, 255, 0.12);
        }
        .navbar-search {
          flex: 1;
          max-width: 720px; /* allow wider centered search */
          position: relative;
          margin: 0 auto; /* center visually between logo and actions */
          align-self: center; /* don't stretch to full header height */
        }
        .navbar-search-icon {
          position: absolute;
          left: 18px; /* a bit more inset to sit nicely inside the input */
          top: 50%;
          transform: translateY(-50%);
          color: #9b8cc4;
          pointer-events: none;
        }
        .navbar-search-input {
          width: 100%;
          padding: 0.7rem 1.1rem 0.7rem 3rem;
          background: #f8f5ff;
          border: 1px solid #e9e2ff;
          border-radius: 999px;
          font-size: 0.95rem;
          color: #1a0533;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 28px rgba(112, 0, 255, 0.06);
        }
        .navbar-search-input:focus {
          border-color: #7000ff;
          box-shadow: 0 10px 36px rgba(112, 0, 255, 0.10);
        }
        .navbar-search-input::placeholder {
          color: #cbbef3;
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
          color: #7000ff;
          display: flex;
          align-items: center;
          padding: 0.4rem;
          border-radius: 50%;
          transition: background 0.2s, transform 0.12s;
        }
        .navbar-cart-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .navbar-cart:active { transform: translateY(1px); }
        .navbar-cart:hover {
          background: #f5f0ff;
        }
        .navbar-cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(45%, -45%) scale(1);
          z-index: 1;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          background: rgb(0, 255, 60);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 0, 85, 0.3);
          border: 2px solid #fbf7ff;
          animation: badge-appear 0.3s ease-out;
          pointer-events: none;
        }
        @keyframes badge-appear {
          0% {
            transform: translate(45%, -45%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(45%, -45%) scale(1.2);
          }
          100% {
            transform: translate(45%, -45%) scale(1);
            opacity: 1;
          }
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
        .navbar-invite {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: none;
          color: #4a3870;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .navbar-invite:hover { background: #f5f0ff; color: #7000ff; }
      `}</style>
    </nav>
  );
}
