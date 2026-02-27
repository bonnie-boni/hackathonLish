"use client";

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useInviteStore } from '@/lib/invite-store';
import { useAuthStore } from '@/lib/auth-store';

export default function PendingInvitesModal() {
  const authUser = useAuthStore((s) => s.user);
  const shopName = useInviteStore((s) => s.shopName);
  const invitedEmails = useInviteStore((s) => s.invitedEmails);
  const collaborators = useInviteStore((s) => s.collaborators);
  const accept = useInviteStore((s) => s.acceptInvite);
  const decline = useInviteStore((s) => s.declineInvite);
  const close = useInviteStore((s) => s.close);

  const [processing, setProcessing] = useState(false);

  if (!authUser) return null;

  // find pending invites that target the logged-in user's email
  const pendingByEmail = invitedEmails.includes(authUser.email);
  const pendingByCollaborator = collaborators.find(
    (c) => c.status === 'pending' && c.user.email === authUser.email
  );
  const hasPending = pendingByEmail || Boolean(pendingByCollaborator);

  if (!hasPending) return null;

  const handleAccept = async () => {
    setProcessing(true);
    accept(authUser.email, authUser);
    setProcessing(false);
    close();
  };

  const handleDecline = async () => {
    setProcessing(true);
    decline(authUser.email);
    setProcessing(false);
    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>You have an invitation</h3>
        </div>
        <div className="modal-body">
          <p>
            {shopName ?? 'A shop'} invited you to collaborate. Accept to join the
            collaborators list.
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn btn-accept" onClick={handleAccept} disabled={processing}>
            <Check size={14} /> Accept
          </button>
          <button className="btn btn-decline" onClick={handleDecline} disabled={processing}>
            <X size={14} /> Decline
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.35); z-index:60; }
        .modal { background: white; border-radius: 12px; padding: 1rem 1.25rem; width: 360px; max-width: 92%; }
        .modal-header h3 { margin:0 0 0.5rem; }
        .modal-body p { margin:0 0 0.75rem; color:#5b4a80 }
        .modal-actions { display:flex; gap:0.5rem; justify-content:flex-end }
        .btn { display:inline-flex; align-items:center; gap:0.5rem; padding:0.45rem 0.7rem; border-radius:8px; border:none; cursor:pointer }
        .btn-accept { background:#00b894; color:white }
        .btn-decline { background:#fff5f5; color:#e17055; border:1px solid #ffc5b8 }
      `}</style>
    </div>
  );
}
