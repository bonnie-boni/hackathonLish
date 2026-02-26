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
  addCollaborators: (emails: string[]) => void;
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
      addCollaborators: (emails: string[]) => {
        const existing = get().invitedEmails;
        const newEmails = emails.filter((e) => !existing.includes(e));
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
          invitedEmails: [...existing, ...newEmails],
          collaborators: [...get().collaborators, ...newCollabs],
        });
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
