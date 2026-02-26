'use client'
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/shop/ProductGrid';
import InviteCollaborators from '@/components/shop/inviteCollaborators';
import { mockProducts } from '@/data/products';
import { Users, ShoppingCart, Mail, Plus, ChevronRight, ChevronLeft } from 'lucide-react';

// Mock data for collaborators and their products
const mockCollaborators = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'AJ',
    products: [
      { id: 101, name: 'Wireless Headphones', price: 79.99 },
      { id: 102, name: 'Phone Case', price: 19.99 }
    ]
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'SC',
    products: [
      { id: 201, name: 'Laptop Sleeve', price: 34.99 },
      { id: 202, name: 'USB-C Hub', price: 45.99 },
      { id: 203, name: 'Desk Lamp', price: 29.99 }
    ]
  },
  {
    id: 3,
    name: 'Marcus Rivera',
    email: 'marcus@example.com',
    avatar: 'MR',
    products: [
      { id: 301, name: 'Coffee Mug', price: 12.99 }
    ]
  }
];

export default function ShopPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [cartName, setCartName] = useState('Weekend Shopping Trip');
  const [isEditingCartName, setIsEditingCartName] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if data exists
  console.log('Products loaded:', mockProducts?.length);

  const handleCartNameChange = (newName: string) => {
    setCartName(newName);
  };

  const handleInviteClose = () => {
    setShowInviteModal(false);
  };

  return (
    <>
      <Navbar />
      <main className="main">
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-section">
            <ShoppingCart size={24} className="cart-icon" />
            {isEditingCartName ? (
              <input
                type="text"
                value={cartName}
                onChange={(e) => setCartName(e.target.value)}
                onBlur={() => setIsEditingCartName(false)}
                onKeyPress={(e) => e.key === 'Enter' && setIsEditingCartName(false)}
                className="cart-name-input"
                autoFocus
              />
            ) : (
              <h1 
                className="cart-name" 
                onClick={() => setIsEditingCartName(true)}
              >
                {cartName}
              </h1>
            )}
          </div>
          <button 
            className="invite-btn"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus size={18} />
            Invite
          </button>
        </div>

        {/* Main Content with Sidebar */}
        <div className="content-wrapper">
          {/* Collaborators Sidebar */}
          <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <button 
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            
            <div className="sidebar-content">
              <h2 className="sidebar-title">
                <Users size={18} />
                {!isSidebarCollapsed && 'Collaborators'}
              </h2>
              
              <div className="collaborators-list">
                {mockCollaborators.map((collaborator) => (
                  <div key={collaborator.id} className="collaborator-item">
                    <div className="collaborator-header">
                      <div className="collaborator-avatar">
                        {collaborator.avatar}
                      </div>
                      {!isSidebarCollapsed && (
                        <div className="collaborator-info">
                          <h3 className="collaborator-name">{collaborator.name}</h3>
                          <p className="collaborator-email">
                            <Mail size={10} />
                            {collaborator.email}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {!isSidebarCollapsed && (
                      <div className="collaborator-products">
                        <h4 className="products-title">
                          Products ({collaborator.products.length})
                        </h4>
                        <div className="products-list">
                          {collaborator.products.map((product) => (
                            <div key={product.id} className="product-item">
                              <span className="product-name">{product.name}</span>
                              <span className="product-price">${product.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {isSidebarCollapsed && (
                      <div className="product-count">
                        {collaborator.products.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className={`products-section ${isSidebarCollapsed ? 'expanded' : ''}`}>
            <h2 className="section-title">
              Products in {cartName}
              <span className="product-count-badge">{mockProducts?.length || 0} items</span>
            </h2>
            
            {/* Display products or fallback */}
            {mockProducts && mockProducts.length > 0 ? (
              <ProductGrid products={mockProducts} />
            ) : (
              <div className="fallback-products">
                <p>Loading products...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showInviteModal && (
        <InviteCollaborators
          isOpen={showInviteModal}
          onClose={handleInviteClose}
          cartName={cartName}
          onCartNameChange={handleCartNameChange}
        />
      )}

      <style jsx>{`
        .main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .cart-title-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cart-icon {
          color: #9333EA;
        }

        .cart-name {
          font-size: 2rem;
          font-weight: 800;
          color: #2e1065;
          margin: 0;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .cart-name:hover {
          background: #f3e8ff;
        }

        .cart-name-input {
          font-size: 2rem;
          font-weight: 800;
          color: #2e1065;
          border: 2px solid #9333EA;
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
          outline: none;
          width: 100%;
          max-width: 400px;
          background: white;
        }

        .invite-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: #9333EA;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .invite-btn:hover {
          background: #7e22ce;
        }

        .content-wrapper {
          display: flex;
          gap: 1.5rem;
          position: relative;
        }

        .sidebar {
          width: 320px;
          flex-shrink: 0;
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 16px;
          padding: 1.25rem;
          height: fit-content;
          position: sticky;
          top: 2rem;
          transition: all 0.3s ease;
          max-height: calc(100vh - 8rem);
          overflow-y: auto;
        }

        .sidebar.collapsed {
          width: 80px;
          padding: 1.25rem 0.75rem;
        }

        .sidebar-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f3e8ff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9333EA;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 10;
        }

        .sidebar-toggle:hover {
          background: #e9d5ff;
        }

        .sidebar-content {
          margin-top: 1.5rem;
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 700;
          color: #2e1065;
          margin: 0 0 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e9d5ff;
        }

        .collaborators-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .collaborator-item {
          padding: 0.75rem;
          background: #faf5ff;
          border-radius: 12px;
          transition: background 0.2s;
          position: relative;
        }

        .collaborator-item:hover {
          background: #f3e8ff;
        }

        .collaborator-header {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .collaborator-avatar {
          width: 40px;
          height: 40px;
          background: #e9d5ff;
          color: #9333EA;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .collaborator-info {
          flex: 1;
          min-width: 0;
        }

        .collaborator-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #2e1065;
          margin: 0 0 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .collaborator-email {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #6b21a8;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-count {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #9333EA;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 999px;
        }

        .collaborator-products {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e9d5ff;
        }

        .products-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b21a8;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          padding: 0.2rem 0;
        }

        .product-name {
          color: #2e1065;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .product-price {
          font-weight: 600;
          color: #9333EA;
          font-size: 0.75rem;
        }

        .products-section {
          flex: 1;
          min-width: 0;
          transition: all 0.3s ease;
        }

        .products-section.expanded {
          margin-left: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.35rem;
          font-weight: 700;
          color: #2e1065;
          margin: 0 0 1.25rem;
        }

        .product-count-badge {
          font-size: 0.9rem;
          font-weight: 600;
          color: #6b21a8;
          background: #f3e8ff;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
        }

        .fallback-products {
          text-align: center;
          padding: 3rem;
          color: #6b21a8;
          font-size: 1rem;
          background: #faf5ff;
          border-radius: 16px;
          border: 1px solid #e9d5ff;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            position: static;
          }
          
          .sidebar.collapsed {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}