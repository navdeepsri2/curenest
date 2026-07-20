import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const product = PRODUCTS.find((p) => String(p.product_id) === String(id)) || PRODUCTS[0];
  const mrp = (product.price * 1.28).toFixed(2);
  const disc = Math.round(((mrp - product.price) / mrp) * 100);

  const relatedProducts = PRODUCTS.filter(
    (x) => x.category_id === product.category_id && x.product_id !== product.product_id
  ).slice(0, 4);

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / <Link to="/products">Medicines</Link> / {product.name}
        </div>
      </div>

      <div className="det-w">
        <div className="det-img" style={{ overflow: 'hidden', padding: '12px', background: '#ffffff' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div>
          <div className="det-brand">{product.brand || 'Generic Brand'}</div>
          <div className="det-name">{product.name}</div>

          {product.prescriptionRequired && (
            <div style={{ marginBottom: '13px' }}>
              <span className="rx-pill" style={{ position: 'static', display: 'inline-block' }}>Rx Required</span>
              <small style={{ color: 'var(--slate)', marginLeft: '7px', fontSize: '12.5px' }}>Valid prescription needed</small>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span className="det-price">₹{product.price}</span>
            <span className="p-mrp" style={{ fontSize: '16px' }}>₹{mrp}</span>
            <span className="p-disc" style={{ fontSize: '14px' }}>{disc}% off</span>
          </div>

          <span className={`stk ${product.stock > 0 ? 'in' : 'out'}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : 'Out of Stock'}
          </span>

          <div className="qw">
            <span style={{ fontWeight: 700, fontSize: '13.5px' }}>Qty:</span>
            <button className="qb" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="qn">{qty}</span>
            <button className="qb" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
            {product.stock > 0 ? (
              <>
                <button className="btn-g" onClick={() => addToCart(product, qty)}>
                  🛒 Add to Cart
                </button>
                <button className="btn-o" onClick={() => { addToCart(product, qty); navigate('/cart'); }}>
                  Buy Now
                </button>
                <Link to="/tools#brand" className="btn-o" style={{ fontSize: '13px' }}>
                  🔗 Find Brands
                </Link>
              </>
            ) : (
              <button className="btn-g" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Out of Stock
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', padding: '15px', background: 'var(--bg)', borderRadius: '12px', marginBottom: '22px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '21px' }}>🚚</div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, marginTop: '3px' }}>Free Delivery</div>
              <div style={{ fontSize: '11px', color: 'var(--fog)' }}>Above ₹299</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '21px' }}>✅</div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, marginTop: '3px' }}>100% Genuine</div>
              <div style={{ fontSize: '11px', color: 'var(--fog)' }}>Authenticated</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '21px' }}>🔄</div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, marginTop: '3px' }}>Easy Returns</div>
              <div style={{ fontSize: '11px', color: 'var(--fog)' }}>7 days</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '21px' }}>🔬</div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, marginTop: '3px' }}>Drug Check</div>
              <div style={{ fontSize: '11px', color: 'var(--fog)' }}>
                <Link to="/tools#interact" style={{ color: 'var(--g)' }}>Check now</Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-nav">
            <button className={`tb ${activeTab === 0 ? 'on' : ''}`} onClick={() => setActiveTab(0)}>Uses</button>
            <button className={`tb ${activeTab === 1 ? 'on' : ''}`} onClick={() => setActiveTab(1)}>Side Effects</button>
            <button className={`tb ${activeTab === 2 ? 'on' : ''}`} onClick={() => setActiveTab(2)}>Dosage</button>
            <button className={`tb ${activeTab === 3 ? 'on' : ''}`} onClick={() => setActiveTab(3)}>Warnings</button>
            <button className={`tb ${activeTab === 4 ? 'on' : ''}`} onClick={() => setActiveTab(4)}>Composition</button>
          </div>

          <div className="tab-body">
            {activeTab === 0 && (
              <div className="t-p on">
                <h4>🩺 Uses & Benefits</h4>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 1 && (
              <div className="t-p on">
                <h4>⚠️ Side Effects</h4>
                <p>Common side effects may include mild dizziness or nausea. Consult your doctor if symptoms persist.</p>
              </div>
            )}
            {activeTab === 2 && (
              <div className="t-p on">
                <h4>💊 Dosage & How to Use</h4>
                <p>{product.dosage}</p>
                <br />
                <Link to="/tools#dose" style={{ color: 'var(--g)', fontWeight: 600, fontSize: '13.5px' }}>
                  🧮 Use our Dosage Calculator →
                </Link>
              </div>
            )}
            {activeTab === 3 && (
              <div className="t-p on">
                <h4>🔴 Warnings & Precautions</h4>
                <p>Keep out of reach of children. Do not exceed the recommended dose without consulting a healthcare professional.</p>
              </div>
            )}
            {activeTab === 4 && (
              <div className="t-p on">
                <h4>🔬 Composition</h4>
                <p>Active pharmaceutical ingredients formulated per PCI guidelines.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="sec sec-alt">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Related</span>
              <h2 className="sec-title">You May Also Like</h2>
            </div>
          </div>
          <div className="pgrid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {relatedProducts.map((r) => {
              const rm = (r.price * 1.28).toFixed(2);
              const rd = Math.round(((rm - r.price) / rm) * 100);
              return (
                <div
                  key={r.product_id}
                  className="pcard"
                  onClick={() => navigate(`/products/${r.product_id}`)}
                >
                  <div className="p-img" style={{ overflow: 'hidden', padding: '6px', background: '#ffffff' }}>
                    <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="p-brand">{r.brand}</div>
                  <div className="p-name">{r.name}</div>
                  <div className="p-pr">
                    <span className="p-price">₹{r.price}</span>
                    <span className="p-mrp">₹{rm}</span>
                    <span className="p-disc">{rd}% off</span>
                  </div>
                  <button
                    className="p-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(r);
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
