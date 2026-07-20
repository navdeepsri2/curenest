import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat');
  const navigate = useNavigate();

  const [selectedCats, setSelectedCats] = useState(
    initialCat ? [Number(initialCat)] : []
  );
  const [rxFilter, setRxFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('df');
  const [displayCount, setDisplayCount] = useState(30);

  const { addToCart } = useStore();

  const handleCatChange = (catId) => {
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
    setDisplayCount(30);
  };

  const clearFilters = () => {
    setSelectedCats([]);
    setRxFilter('all');
    setMaxPrice(3000);
    setSortBy('df');
    setDisplayCount(30);
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat =
        selectedCats.length === 0 || selectedCats.includes(p.category_id);
      const matchRx =
        rxFilter === 'all' ||
        (rxFilter === 'yes' && p.prescriptionRequired) ||
        (rxFilter === 'no' && !p.prescriptionRequired);
      const matchPrice = p.price <= maxPrice;
      return matchCat && matchRx && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'pa') return a.price - b.price;
      if (sortBy === 'pd') return b.price - a.price;
      if (sortBy === 'na') return a.name.localeCompare(b.name);
      return a.product_id - b.product_id;
    });
  }, [selectedCats, rxFilter, maxPrice, sortBy]);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / All Medicines
        </div>
        <h1>All Medicines & Health Products ({PRODUCTS.length.toLocaleString()} items)</h1>
        <p>Browse {PRODUCTS.length.toLocaleString()} genuine medicines loaded from dataset</p>
      </div>

      <div className="p-lay">
        <aside className="fside">
          <div className="fbox">
            <h3>Categories</h3>
            {[
              { id: 1, name: 'Vitamins & Supplements' },
              { id: 2, name: 'Pain Relief & Fever' },
              { id: 3, name: 'Skincare' },
              { id: 4, name: 'Cold & Flu' },
              { id: 5, name: 'Diabetes Care' },
              { id: 6, name: 'Heart Care' },
              { id: 7, name: 'Antibiotics' },
              { id: 8, name: 'Digestion' },
              { id: 9, name: 'Eye & Ear Care' },
              { id: 10, name: 'Ayurvedic' },
            ].map((cat) => (
              <label key={cat.id} className="fopt">
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat.id)}
                  onChange={() => handleCatChange(cat.id)}
                />{' '}
                {cat.name}
              </label>
            ))}
          </div>

          <div className="fbox">
            <h3>Prescription</h3>
            <label className="fopt">
              <input
                type="radio"
                name="rx"
                value="all"
                checked={rxFilter === 'all'}
                onChange={() => { setRxFilter('all'); setDisplayCount(30); }}
              />{' '}
              All Products
            </label>
            <label className="fopt">
              <input
                type="radio"
                name="rx"
                value="no"
                checked={rxFilter === 'no'}
                onChange={() => { setRxFilter('no'); setDisplayCount(30); }}
              />{' '}
              Without Rx
            </label>
            <label className="fopt">
              <input
                type="radio"
                name="rx"
                value="yes"
                checked={rxFilter === 'yes'}
                onChange={() => { setRxFilter('yes'); setDisplayCount(30); }}
              />{' '}
              Requires Rx
            </label>
          </div>

          <div className="fbox">
            <h3>Max Price</h3>
            <input
              type="range"
              min="0"
              max="3000"
              value={maxPrice}
              style={{ width: '100%', accentColor: 'var(--g)' }}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setDisplayCount(30); }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '5px', color: 'var(--slate)' }}>
              <span>₹0</span>
              <span style={{ color: 'var(--g)', fontWeight: 700 }}>₹{maxPrice}</span>
            </div>
          </div>

          <button onClick={clearFilters} className="btn-o" style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '13px' }}>
            Clear Filters
          </button>
        </aside>

        <div className="p-main">
          <div className="toolbar">
            <span className="p-count">Showing {displayedProducts.length} of {filteredProducts.length.toLocaleString()} Products</span>
            <select
              className="sort-sel"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setDisplayCount(30); }}
            >
              <option value="df">Sort: Default</option>
              <option value="pa">Price: Low → High</option>
              <option value="pd">Price: High → Low</option>
              <option value="na">Name: A → Z</option>
            </select>
          </div>

          <div className="pgrid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {displayedProducts.map((p) => {
              const mrp = (p.price * 1.28).toFixed(2);
              const disc = Math.round(((mrp - p.price) / mrp) * 100);
              return (
                <div
                  key={p.product_id}
                  className="pcard"
                  onClick={() => navigate(`/products/${p.product_id}`)}
                >
                  {p.prescriptionRequired && <span className="rx-pill">Rx</span>}
                  <div className="p-img" style={{ overflow: 'hidden', padding: '6px', background: '#ffffff' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="p-brand">{p.brand}</div>
                  <div className="p-name">{p.name}</div>
                  <div className="p-pr">
                    <span className="p-price">₹{p.price}</span>
                    <span className="p-mrp">₹{mrp}</span>
                    <span className="p-disc">{disc}% off</span>
                  </div>
                  <button
                    className="p-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              );
            })}
          </div>

          {displayCount < filteredProducts.length && (
            <div style={{ textCenter: 'center', textAlign: 'center', marginTop: '32px' }}>
              <button
                className="btn-g"
                onClick={() => setDisplayCount((prev) => prev + 30)}
              >
                Load More Medicines ({filteredProducts.length - displayCount} remaining) →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
