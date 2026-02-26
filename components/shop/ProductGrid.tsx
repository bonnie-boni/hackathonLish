'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const CATEGORIES = ['All', 'Food', 'Drinks', 'Clothing', 'Electronics', 'Accessories', 'Home'];

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('Newest');
  const [category, setCategory] = useState('All');

  const filtered = products.filter(
    (p) => category === 'All' || p.category === category
  );

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="grid-title-wrap">
          <h2 className="grid-title">{title ?? 'Our Products'}</h2>
          <p className="grid-subtitle">{subtitle ?? 'Browse our curated selection of high-quality items.'}</p>
        </div>
        <div className="grid-controls">
          <div className="sort-select">
            <span>Sort by: {sortBy}</span>
            <ChevronDown size={14} />
          </div>
          <button className="filter-btn">
            <SlidersHorizontal size={14} />
            Price Range
          </button>
        </div>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <style jsx>{`
        .grid-container { width: 100%; }
        .grid-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .grid-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1a0533;
          margin: 0 0 0.25rem;
        }
        .grid-subtitle {
          color: #7a6898;
          font-size: 0.9rem;
          margin: 0;
        }
        .grid-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .sort-select, .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1rem;
          border: 1px solid #e8e0ff;
          border-radius: 8px;
          background: white;
          font-size: 0.85rem;
          color: #4a3870;
          cursor: pointer;
        }
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .category-tab {
          padding: 0.35rem 1rem;
          border-radius: 999px;
          border: 1px solid #e8e0ff;
          background: white;
          font-size: 0.82rem;
          font-weight: 500;
          color: #7a6898;
          cursor: pointer;
          transition: all 0.2s;
        }
        .category-tab.active, .category-tab:hover {
          background: #7000ff;
          color: white;
          border-color: #7000ff;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
      `}</style>
    </div>
  );
}
