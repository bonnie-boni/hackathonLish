import { create } from 'zustand';
import { User } from '@/types';

interface InviteStore {
  isOpen: boolean;
  shopName?: string;
  createdBy?: User;
  createdAt?: string;
  open: (shopName?: string) => void;
  close: () => void;
  setShopName: (name: string) => void;
  setCreatedBy: (user?: User) => void;
  setCreatedAt: (iso?: string) => void;
}

export const useInviteStore = create<InviteStore>((set) => ({
  isOpen: false,
  shopName: undefined,
  createdBy: undefined,
  createdAt: undefined,
  open: (shopName) => set((s) => ({ isOpen: true, shopName: shopName ?? s.shopName })),
  close: () => set({ isOpen: false, shopName: undefined, createdBy: undefined, createdAt: undefined }),
  setShopName: (name: string) => set({ shopName: name }),
  setCreatedBy: (user?: User) => set({ createdBy: user }),
  setCreatedAt: (iso?: string) => set({ createdAt: iso }),
}));
