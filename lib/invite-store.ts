import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Collaborator } from '@/types';

interface InviteStore {
  isOpen: boolean;
  shopName?: string;
  createdBy?: User;
  createdAt?: string;
  collaborators: Collaborator[];
  invitedEmails: string[];
  open: (shopName?: string) => void;
  close: () => void;
  setShopName: (name: string) => void;
  setCreatedBy: (user?: User) => void;
  setCreatedAt: (iso?: string) => void;
  addCollaborators: (emails: string[]) => Promise<void>;
  acceptInvite: (email: string, user?: User) => void;
  declineInvite: (email: string) => void;
  removeCollaborator: (email: string) => Promise<void>;
  syncFromServer: (shopId?: string) => Promise<void>;
  reset: () => void;
}

export const useInviteStore = create<InviteStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      shopName: undefined,
      createdBy: undefined,
      createdAt: undefined,
      collaborators: [],
      invitedEmails: [],
      open: (shopName) => set((s) => ({ isOpen: true, shopName: shopName ?? s.shopName })),
      close: () => set({ isOpen: false }),
      setShopName: (name: string) => set({ shopName: name }),
      setCreatedBy: (user?: User) => set({ createdBy: user }),
      setCreatedAt: (iso?: string) => set({ createdAt: iso }),
      addCollaborators: async (emails: string[]) => {
        const existingInvited = get().invitedEmails;
        const existingCollabs = get().collaborators;
        const existingCollabEmails = new Set(existingCollabs.map((c) => (c.user.email || '').toLowerCase().trim()));

        // normalize incoming emails and filter out already invited/collaborators
        const normalized = emails.map((e) => e.toLowerCase().trim());
        const newEmails = normalized.filter(
          (e) => e && !existingInvited.map((x) => x.toLowerCase().trim()).includes(e) && !existingCollabEmails.has(e)
        );
        if (newEmails.length === 0) return;

        const newCollabs: Collaborator[] = newEmails.map((email) => ({
          user: {
            id: `invited-${email}`,
            name: email.split('@')[0],
            email,
            initials: email.slice(0, 2).toUpperCase(),
          },
          status: 'pending' as const,
        }));

        set({
          invitedEmails: [...existingInvited, ...newEmails],
          collaborators: [...existingCollabs, ...newCollabs],
        });

        // Persist invites server-side
        try {
          await fetch('/api/collaborators', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shopId: useInviteStore.getState().shopName || null, emails: newEmails }),
          });
        } catch (err) {
          console.warn('Failed to persist invites', err);
        }
      },
      acceptInvite: (email: string, user?: User) => {
        const existingInvited = get().invitedEmails;
        const newInvited = existingInvited.filter((e) => e !== email);

        const replacedUser: User =
          user ?? {
            id: `user-${email}`,
            name: email.split('@')[0],
            email,
            initials: email.slice(0, 2).toUpperCase(),
          };

        const collaborators = get().collaborators.slice();
        let found = false;
        for (let i = 0; i < collaborators.length; i++) {
          const c = collaborators[i];
          if (c.user.email === email || c.user.id === `invited-${email}`) {
            collaborators[i] = { user: replacedUser, status: 'active' as const };
            found = true;
          }
        }
        if (!found) {
          collaborators.push({ user: replacedUser, status: 'active' });
        }

        set({ invitedEmails: newInvited, collaborators });
      },
      declineInvite: (email: string) => {
        const newInvited = get().invitedEmails.filter((e) => e !== email);
        const collaborators = get().collaborators.filter(
          (c) => c.user.email !== email && c.user.id !== `invited-${email}`
        );
        set({ invitedEmails: newInvited, collaborators });
      },
      removeCollaborator: async (email: string) => {
        // Owner removal: remove collaborator (whether pending or active) and any invited marker
        const collaborators = get().collaborators.filter(
          (c) => c.user.email !== email && c.user.id !== `invited-${email}`
        );
        const invitedEmails = get().invitedEmails.filter((e) => e !== email);
        set({ collaborators, invitedEmails });
        // Persist removal server-side
        try {
          await fetch('/api/collaborators', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shopId: useInviteStore.getState().shopName || null, email }),
          });
        } catch (err) {
          console.warn('Failed to remove collaborator server-side', err);
        }
      },

      // Sync local invite/collab state with server for a given shopId
      // Returns the synced state
      syncFromServer: async (shopId?: string) => {
        if (!shopId) return;
        try {
          const res = await fetch(`/api/collaborators?shopId=${encodeURIComponent(shopId)}`);
          const data = await res.json();
          const serverCollabs = (data.collaborators ?? []).map((c: any) => ({
            user: {
              id: c.profiles?.id ?? c.user_id ?? `user-${c.user_id}`,
              name: c.profiles?.name ?? c.user_id,
              email: c.profiles?.email ?? null,
              initials: c.profiles?.initials ?? (c.profiles?.name ? c.profiles.name.slice(0,2).toUpperCase() : '??'),
            },
            status: c.status ?? 'pending',
          }));
          const serverInvites = (data.invites ?? []).map((i: any) => i.email);
          set({ collaborators: serverCollabs, invitedEmails: serverInvites, shopName: shopId });
        } catch (err) {
          console.warn('Failed to sync invites from server', err);
        }
      },
      reset: () =>
        set({
          isOpen: false,
          shopName: undefined,
          createdBy: undefined,
          createdAt: undefined,
          collaborators: [],
          invitedEmails: [],
        }),
    }),
    { name: 'modernshop-invite' }
  )
);
