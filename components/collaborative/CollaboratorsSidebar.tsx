'use client';

import { Collaborator } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  cartTotal: number;
  cartGoal: number;
  onManagePermissions: () => void;
}

export default function CollaboratorsSidebar({
  collaborators,
  cartTotal,
  cartGoal,
  onManagePermissions,
}: CollaboratorsListProps) {
  const progress = Math.min((cartTotal / cartGoal) * 100, 100);

  return (
    <aside className="sidebar">

      {/* Collaborators */}
      <div className="widget">
        <div className="widget-header">
          <h3 className="widget-title">Collaborators</h3>
          <span className="active-badge">
            {collaborators.filter((c) => c.status === 'active').length} active
          </span>
        </div>

        <ul className="collab-list">
          {collaborators.map((c) => (
            <li key={c.user.id} className="collab-item">
              <div className={`collab-avatar ${c.status === 'pending' ? 'pending' : ''}`}>
                {c.status === 'pending' ? (
                  <span className="pending-label">PENDING</span>
                ) : (
                  c.user.initials
                )}
              </div>
              <div className="collab-info">
                <span className="collab-name">{c.user.name}</span>
              </div>
            </li>
          ))}
        </ul>

        <button className="manage-btn" onClick={onManagePermissions}>
          Invite
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 260px;
          max-width: 300px;
        }
        .widget {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid #f0eeff;
        }
        .widget-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .widget-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a0533;
          margin: 0 0 0.75rem;
        }
        .widget-header .widget-title { margin-bottom: 0; }
        .active-badge {
          background: #e8fff4;
          color: #00b894;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .cart-total {
          font-size: 1.5rem;
          font-weight: 800;
          color: #7000ff;
          margin-bottom: 0.75rem;
        }
        .progress-bar-wrap {
          height: 8px;
          background: #f0eeff;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7000ff, #a855f7);
          border-radius: 999px;
          transition: width 0.5s ease;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #9b8cc4;
        }
        .collab-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .collab-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .collab-avatar {
          width: 38px;
          height: 38px;
          background: #e8d8ff;
          color: #7000ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .collab-avatar.pending {
          background: #f5f0ff;
          color: #b0a0d0;
        }
        .pending-label {
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .collab-info {
          display: flex;
          flex-direction: column;
        }
        .collab-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a0533;
        }
        /* roles removed; collaborators are shown without role labels */
        .manage-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.55rem;
          background: white;
          border: 1px solid #e8e0ff;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #7000ff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .manage-btn:hover { background: #f5f0ff; }
      `}</style>
    </aside>
  );
}
