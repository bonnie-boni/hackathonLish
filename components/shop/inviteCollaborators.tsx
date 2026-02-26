import { useInviteStore } from '@/lib/invite-store';

export const openInviteCollaborators = (shopName?: string) => {
  useInviteStore.getState().open(shopName);
};

export const closeInviteCollaborators = () => {
  useInviteStore.getState().close();
};

export default function InviteCollaboratorsHelper() {
  return <div style={{ display: 'none' }} />;
}
