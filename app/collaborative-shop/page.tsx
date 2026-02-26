'use client';

import { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CollaboratorsSidebar from '@/components/collaborative/CollaboratorsSidebar';
import InviteCollaboratorsModal from '@/components/collaborative/InviteCollaboratorsModal';
import { openInviteCollaborators } from '@/components/shop/inviteCollaborators';
import { mockCollaborativeShop } from '@/data/users';
import { formatCurrency } from '@/lib/utils';
import { useInviteStore } from '@/lib/invite-store';

const TABS = ['Products', 'Discussion', 'Activity Log'] as const;
type Tab = typeof TABS[number];

export default function CollaborativeShopPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Products');
  const store = useInviteStore();

  const shop = {
    ...mockCollaborativeShop,
    name: store.shopName ?? mockCollaborativeShop.name,
    createdBy: store.createdBy ?? mockCollaborativeShop.createdBy,
    lastActive: store.createdAt
      ? new Date(store.createdAt).toLocaleString()
      : mockCollaborativeShop.lastActive,
  };

  return (
    <>
      <Navbar />
      <main className="main">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <div className="collab-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Collaborative Shopping
            </div>
            <h1 className="page-title">{shop.name}</h1>
            <p className="page-meta">
              Created by{' '}
              <span className="creator">{shop.createdBy.name}</span>{' '}
              • Last active {shop.lastActive}
            </p>
          </div>

          <div className="header-actions">
            <button
              className="invite-btn"
              onClick={() => openInviteCollaborators(shop.name)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Invite
            </button>
            <button className="settings-btn">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <CollaboratorsSidebar
            collaborators={shop.collaborators}
            cartTotal={shop.cartTotal}
            cartGoal={shop.cartGoal}
            onManagePermissions={() => openInviteCollaborators(shop.name)}
          />

          <div className="products-section">
            {/* Tabs */}
            <div className="tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}{tab === 'Products' ? ` (${shop.products.length + 9})` : ''}
                </button>
              ))}
            </div>

            {activeTab === 'Products' && (
              <div className="products-grid">
                {shop.products.map((product) => (
                  <div key={product.id} className="collab-card">
                    <div className="collab-image-wrap">
                      <img src={product.image} alt={product.name} className="collab-image" />
                      {product.badge && (
                        <span className={`collab-badge ${product.badge.toLowerCase().replace(' ', '-')}`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="collab-card-body">
                      <div className="collab-name-price">
                        <span className="collab-name">{product.name}</span>
                        <span className="collab-price">{formatCurrency(product.price)}</span>
                      </div>
                      <p className="collab-desc">{product.description}</p>
                      <div className="collab-footer">
                        <div className="voter-avatars">
                          {product.votedBy.map((u) => (
                            <div key={u.id} className="voter-avatar" title={u.name}>
                              {u.initials}
                            </div>
                          ))}
                        </div>
                        <button className="collab-cart-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Product */}
                <div className="add-product-card">
                  <button className="add-product-btn">
                    <Plus size={24} />
                  </button>
                  <h3 className="add-title">Add New Product</h3>
                  <p className="add-sub">Paste a link or browse products</p>
                </div>
              </div>
            )}

            {activeTab === 'Discussion' && (
              <div className="empty-tab">
                <p>Discussion board coming soon...</p>
              </div>
            )}

            {activeTab === 'Activity Log' && (
              <div className="empty-tab">
                <p>Activity log coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <InviteCollaboratorsModal />

      <style jsx>{`
        .main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .collab-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #7000ff;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.4rem;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a0533;
          margin: 0 0 0.25rem;
        }
        .page-meta {
          font-size: 0.88rem;
          color: #7a6898;
          margin: 0;
        }
        .creator { color: #7000ff; font-weight: 600; }
        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .invite-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .invite-btn:hover { background: #5900cc; }
        .settings-btn {
          width: 40px;
          height: 40px;
          background: white;
          border: 1px solid #e8e0ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #7a6898;
          transition: background 0.2s;
        }
        .settings-btn:hover { background: #f5f0ff; }
        .content {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .products-section { flex: 1; min-width: 0; }
        .tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #f0eeff;
          margin-bottom: 1.5rem;
        }
        .tab {
          padding: 0.6rem 1.25rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 0.9rem;
          font-weight: 500;
          color: #9b8cc4;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -1px;
        }
        .tab.active {
          color: #7000ff;
          border-bottom-color: #7000ff;
          font-weight: 600;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .collab-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0eeff;
        }
        .collab-image-wrap {
          position: relative;
          height: 160px;
          background: #f8f5ff;
          overflow: hidden;
        }
        .collab-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .collab-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .collab-badge.popular { background: #7000ff; }
        .collab-badge.low-stock { background: #e17055; }
        .collab-badge.new { background: #00b894; }
        .collab-card-body { padding: 0.875rem; }
        .collab-name-price {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.3rem;
        }
        .collab-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a0533;
          line-height: 1.3;
        }
        .collab-price {
          font-size: 0.9rem;
          font-weight: 700;
          color: #7000ff;
          white-space: nowrap;
        }
        .collab-desc {
          font-size: 0.78rem;
          color: #7a6898;
          margin: 0 0 0.75rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .collab-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .voter-avatars {
          display: flex;
          gap: -4px;
        }
        .voter-avatar {
          width: 26px;
          height: 26px;
          background: #e8d8ff;
          color: #7000ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          border: 2px solid white;
          margin-right: -6px;
        }
        .collab-cart-btn {
          width: 34px;
          height: 34px;
          background: #f5f0ff;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7000ff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .collab-cart-btn:hover { background: #e0d0ff; }
        .add-product-card {
          background: white;
          border: 2px dashed #e0d0ff;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          min-height: 240px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .add-product-card:hover {
          border-color: #7000ff;
          background: #fdfaff;
        }
        .add-product-btn {
          width: 52px;
          height: 52px;
          background: #e8d8ff;
          color: #7000ff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 0.75rem;
          transition: background 0.2s;
        }
        .add-product-card:hover .add-product-btn { background: #7000ff; color: white; }
        .add-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 0.25rem;
        }
        .add-sub {
          font-size: 0.8rem;
          color: #9b8cc4;
          margin: 0;
        }
        .empty-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #9b8cc4;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}
