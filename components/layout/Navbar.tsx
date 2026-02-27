"use client";

import Link from 'next/link';
import { ShoppingCart, LogOut } from 'lucide-react';
import { openInviteCollaborators } from '@/components/shop/inviteCollaborators';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { mockCurrentUser } from '@/data/users';
import PendingInvitesModal from '@/components/collaborative/PendingInvitesModal';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useInviteStore } from '@/lib/invite-store';

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems)();
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const currentUser = authUser ?? mockCurrentUser;
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Redirect a user to /shop if they were removed from the collaboration
  const collaborators = useInviteStore((s) => s.collaborators);
  const prevIsMemberRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!authUser) return;
    const isMember = collaborators.some(
      (c) => c.user.email === authUser.email || c.user.id === authUser.id
    );

    // initialize previous state
    if (prevIsMemberRef.current === null) {
      prevIsMemberRef.current = isMember;
      return;
    }

    // if previously a member but now not, redirect them to products page
    if (prevIsMemberRef.current === true && isMember === false) {
      router.push('/shop');
    }

    prevIsMemberRef.current = isMember;
  }, [collaborators, authUser, router]);

  // Also listen for storage events so removals in another tab/window
  // (persisted via localStorage by zustand) redirect this client to /shop.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== 'modernshop-invite') return;
      if (!authUser) return;
      try {
        const next = e.newValue ? JSON.parse(e.newValue) : null;
        const nextCollabs: any[] = next?.state?.collaborators ?? [];
        const isMember = nextCollabs.some(
          (c) => c.user?.email === authUser.email || c.user?.id === authUser.id
        );
        if (!isMember) router.push('/shop');
      } catch {
        // ignore parse errors
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [authUser, router]);
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
          <input
            type="text"
            placeholder="Search products..."
            className="navbar-search-input"
          />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button
            className="navbar-invite-btn"
            onClick={() => openInviteCollaborators()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Invite
          </button>
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

          <div className="navbar-avatar" title={currentUser.name}>
            {currentUser.initials}
          </div>
          <button className="navbar-logout-btn" onClick={handleLogout} title="Sign out">
            <LogOut size={16} />
          </button>
          <PendingInvitesModal />
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
          position: relative;
          flex: 1;
          max-width: 720px;
          margin: 0 auto;
          display: block;
        }
        .navbar-search-input {
          width: 100%;
          height: 44px;
          padding-left: 16px;
          padding-right: 16px;
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
          justify-content: center;
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
          background: rgb(127, 0, 255);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 999px;
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
        .navbar-invite-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .navbar-invite-btn:hover { background: #5900cc; }
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
        .navbar-logout-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid #e8e0ff;
          color: #7a6898;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .navbar-logout-btn:hover {
          background: #fff5f5;
          color: #e17055;
          border-color: #ffc5b8;
        }
      `}</style>
    </nav>
  );
}