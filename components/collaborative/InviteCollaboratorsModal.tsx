'use client';

import { useState } from 'react';
import { X, Mail, Users, Check } from 'lucide-react';
import { useInviteStore } from '@/lib/invite-store';
import { useAuthStore } from '@/lib/auth-store';
import { mockCurrentUser } from '@/data/users';
import { Collaborator } from '@/types';

interface InviteCollaboratorsProps {
  isOpen?: boolean;
  onClose?: () => void;
  shopName?: string;
}

export default function InviteCollaboratorsModal({
  isOpen,
  onClose,
  shopName,
}: InviteCollaboratorsProps) {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  // Prefer external props; fall back to global invite store
  const store = useInviteStore();

  const isOpenFinal = typeof isOpen === 'boolean' ? isOpen : store.isOpen;
  const onCloseFinal = onClose ?? store.close;
  const shopNameFinal = shopName ?? store.shopName ?? 'Shop';
  const [cartName, setCartName] = useState(shopNameFinal);

  // members: show collaborators from the invite store
  const members: Collaborator[] = store.collaborators;
  const authUser = useAuthStore((s) => s.user);
  const isOwner = !!(useInviteStore.getState().createdBy && authUser && useInviteStore.getState().createdBy?.id === authUser.id);

  if (!isOpenFinal) return null;

  const handleAddInvite = () => {
    if (!email || !email.includes('@')) return;
    setInvites([...invites, email]);
    setEmail('');
  };

  const handleSendInvites = () => {
    // Persist cart name + owner first
    handleSaveCartName();
    // Persist invited emails as collaborators
    store.addCollaborators(invites);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setInvites([]);
      onCloseFinal();
    }, 1500);
  };

  const handleSaveCartName = () => {
    useInviteStore.getState().setShopName(cartName);
    // if createdBy/createdAt not set, set them to current user and now
    const st = useInviteStore.getState();
    const authUser = useAuthStore.getState().user;
    if (!st.createdBy) useInviteStore.getState().setCreatedBy(authUser ?? mockCurrentUser);
    if (!st.createdAt) useInviteStore.getState().setCreatedAt(new Date().toISOString());
  };

  return (
    <div className="modal-overlay" onClick={onCloseFinal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Users size={20} />
            </div>
            <div>
              <h2 className="modal-title">Invite Collaborators</h2>
              <p className="modal-subtitle">Add people to <strong>{shopNameFinal}</strong></p>
            </div>
          </div>
          <button className="modal-close" onClick={onCloseFinal}>
            <X size={20} />
          </button>
        </div>

        {/* Cart name (editable) */}
        <div className="section">
          <label className="section-label">Cart Name</label>
          <div className="link-row">
            <input
              className="cart-name-input"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="My collaborative cart"
            />
            <button className="copy-btn" onClick={handleSaveCartName}>Save</button>
          </div>
        </div>

        <div className="divider"><span>Members</span></div>

        {/* Email Input */}
        <div className="section">
          <label className="section-label">Email Address</label>
          <div className="input-row">
            <div className="email-input-wrap">
              <Mail size={15} className="input-icon" />
              <input
                type="email"
                placeholder="colleague@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInvite()}
                className="email-input"
              />
            </div>
            <button className="add-btn" onClick={handleAddInvite}>Add</button>
          </div>
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="invites-list">
            {invites.map((emailStr, i) => (
              <div key={i} className="invite-row">
                <div className="invite-avatar">{emailStr[0].toUpperCase()}</div>
                <span className="invite-email">{emailStr}</span>
                <button
                  className="remove-invite"
                  onClick={() => setInvites(invites.filter((_, j) => j !== i))}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Members List (current collaborators) */}
        <div className="invites-list">
          {members.map((m, idx) => (
            <div key={m.user.id} className="invite-row">
              <div className="invite-avatar">{m.user.initials}</div>
              <span className="invite-email">{m.user.name}</span>
              <span className="member-status">{m.status.toUpperCase()}</span>
              {isOwner && (
                <button
                  className="remove-invite"
                  title="Remove collaborator"
                  onClick={() => useInviteStore.getState().removeCollaborator(m.user.email)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Note: Invited users can edit the shared cart */}
        <div className="role-info">
          <div className="role-info-item">
            Invited collaborators can edit the shared cart.
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
            <button className="cancel-btn" onClick={onCloseFinal}>Cancel</button>
          <button
            className="send-btn"
            onClick={handleSendInvites}
            disabled={invites.length === 0}
          >
            {sent ? (
              <><Check size={16} /> Invites Sent!</>
            ) : (
              <><Mail size={16} /> Send {invites.length > 0 ? `${invites.length} ` : ''}Invite{invites.length !== 1 ? 's' : ''}</>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 0, 30, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 24px 80px rgba(112, 0, 255, 0.18);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #f0eeff;
        }
        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .modal-icon {
          width: 40px;
          height: 40px;
          background: #f0e8ff;
          color: #7000ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 2px;
        }
        .modal-subtitle {
          font-size: 0.82rem;
          color: #7a6898;
          margin: 0;
        }
        .modal-close {
          background: #f5f0ff;
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #7a6898;
          transition: background 0.2s;
        }
        .modal-close:hover { background: #e8d8ff; }
        .section {
          padding: 1rem 1.5rem 0;
        }
        .section-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4a3870;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .link-row {
          display: flex;
          align-items: center;
          background: #f8f5ff;
          border: 1px solid #e8e0ff;
          border-radius: 10px;
          padding: 0.5rem 0.5rem 0.5rem 0.875rem;
          gap: 0.5rem;
        }
        .link-text {
          flex: 1;
          font-size: 0.78rem;
          color: #7a6898;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cart-name-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          padding: 0.35rem 0.5rem;
          outline: none;
        }
        .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.75rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .copy-btn:hover { background: #5900cc; }
        .divider {
          text-align: center;
          position: relative;
          margin: 1rem 1.5rem;
          color: #b0a0d0;
          font-size: 0.78rem;
        }
        .divider::before, .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 3rem);
          height: 1px;
          background: #f0eeff;
        }
        .divider::before { left: 0; }
        .divider::after { right: 0; }
        .input-row {
          display: flex;
          gap: 0.5rem;
        }
        .email-input-wrap {
          flex: 1;
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9b8cc4;
        }
        .email-input {
          width: 100%;
          padding: 0.55rem 0.75rem 0.55rem 2.2rem;
          border: 1px solid #e8e0ff;
          border-radius: 10px;
          font-size: 0.85rem;
          color: #1a0533;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .email-input:focus { border-color: #7000ff; }
        .add-btn {
          padding: 0.55rem 1rem;
          background: #f0e8ff;
          color: #7000ff;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .add-btn:hover { background: #e0d0ff; }
        .invites-list {
          margin: 1rem 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .member-status {
          font-size: 0.68rem;
          color: #7a6898;
          background: #f5f0ff;
          padding: 4px 8px;
          border-radius: 999px;
          font-weight: 600;
        }
        .invite-avatar {
          width: 28px;
          height: 28px;
          background: #7000ff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .invite-email {
          flex: 1;
          font-size: 0.85rem;
          color: #1a0533;
        }
        /* role select and invite role removed - invites are emails only */
        .remove-invite {
          background: none;
          border: none;
          color: #b0a0d0;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .remove-invite:hover { color: #e17055; }
        .role-info {
          margin: 1rem 1.5rem 0;
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          background: #fdfaff;
          border-radius: 10px;
          border: 1px solid #f0eeff;
        }
        .role-info-item {
          font-size: 0.78rem;
          color: #7a6898;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1rem 1.5rem 1.5rem;
          margin-top: 1rem;
        }
        .cancel-btn {
          padding: 0.6rem 1.25rem;
          background: white;
          border: 1px solid #e8e0ff;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #7a6898;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .cancel-btn:hover { background: #f5f0ff; }
        .send-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.25rem;
          background: #7000ff;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }
        .send-btn:hover:not(:disabled) { background: #5900cc; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
