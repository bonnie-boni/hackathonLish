import Navbar from '@/components/layout/Navbar';
import ProductGrid from '@/components/shop/ProductGrid';
import { mockProducts } from '@/data/products';

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="main">
        <ProductGrid products={mockProducts} />
      </main>
      <style jsx>{`
        .main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
      `}</style>
    </>
  );
}
