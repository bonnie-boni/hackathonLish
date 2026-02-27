'use client'
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/shop/ProductGrid';
import CollaboratorsSidebar from '@/components/collaborative/CollaboratorsSidebar';
import InviteCollaboratorsModal from '@/components/collaborative/InviteCollaboratorsModal';
import { mockProducts } from '@/data/products';
import { mockCurrentUser } from '@/data/users';
import { useAuthStore } from '@/lib/auth-store';
import { fetchProducts } from '@/lib/supabase/queries';
import { useInviteStore } from '@/lib/invite-store';
import { useCartStore } from '@/lib/cart-store';
import { Product } from '@/types';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const shopName = useInviteStore((s) => s.shopName);
  const createdBy = useInviteStore((s) => s.createdBy);
  const collaborators = useInviteStore((s) => s.collaborators);
  const subtotal = useCartStore((s) => s.subtotal)();

  // Build the owner as the first collaborator
  const authUser = useAuthStore((s) => s.user);
  const owner = createdBy ?? authUser ?? mockCurrentUser;
  const allCollaborators = [
    { user: owner, status: 'active' as const },
    ...collaborators,
  ];

  const hasInvited = !!shopName;

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data.length > 0) setProducts(data);
    });
  }, []);

  const title = hasInvited ? shopName : undefined;
  const subtitle = hasInvited
    ? `Created by ${owner.name}`
    : undefined;

  return (
    <>
      <Navbar />
      <main className="main">
        <div className={`shop-layout ${hasInvited ? 'with-sidebar' : ''}`}>
          {hasInvited && (
            <CollaboratorsSidebar
              collaborators={allCollaborators}
              cartTotal={subtotal}
              cartGoal={500}
              onManagePermissions={() => useInviteStore.getState().open(shopName)}
            />
          )}
          <div className="shop-content">
            <ProductGrid products={products} title={title} subtitle={subtitle} />
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
        .shop-layout {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .shop-content {
          flex: 1;
          min-width: 0;
        }
      `}</style>
    </>
  );
}