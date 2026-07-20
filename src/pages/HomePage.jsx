import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';

export default function HomePage() {
  const { addToCart } = useStore();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-geo"></div>
        <div className="hblob hb1"></div>
        <div className="hblob hb2"></div>
        <div className="hblob hb3"></div>
        <div className="hero-l">
          <div className="hero-badge">⚡ 30-min Express Delivery in Delhi & NCR</div>
          <h1 className="hero-h1">
            Your health,<br />
            <em>our priority.</em>
          </h1>
          <p className="hero-p">
            India's trusted online pharmacy — genuine medicines, doctor prescriptions verified, delivered with care to your doorstep.
          </p>
          <div className="hero-ctas">
            <Link to="/products" className="btn-g">Shop Medicines →</Link>
            <Link to="/upload-prescription" className="btn-o">📋 Upload Rx</Link>
          </div>
          <div className="hero-stats">
            <div className="hstat">
              <strong>200+</strong>
              <small>Medicines</small>
            </div>
            <div className="hdiv"></div>
            <div className="hstat">
              <strong>30m</strong>
              <small>Avg Delivery</small>
            </div>
            <div className="hdiv"></div>
            <div className="hstat">
              <strong>100%</strong>
              <small>Genuine</small>
            </div>
          </div>
        </div>

        <div className="hero-r">
          <div className="orbit">
            <div className="orbit-c" style={{ width: '220px', height: '220px', overflow: 'hidden', padding: 0 }}>
              <img src="/images/doctor_consult.png" alt="Doctor Consultation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>


            <div className="ocard oc1">
              <span>🩹</span>
              <div>
                <b>Pain Relief</b>
                <small>Fast action</small>
              </div>
            </div>
            <div className="ocard oc2">
              <span>🌿</span>
              <div>
                <b>Vitamins</b>
                <small>Daily wellness</small>
              </div>
            </div>
            <div className="ocard oc3">
              <span>✨</span>
              <div>
                <b>Skincare</b>
                <small>Dermatologist picked</small>
              </div>
            </div>
            <div className="ocard oc4">
              <span>🩸</span>
              <div>
                <b>Diabetes</b>
                <small>Monitoring & care</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="trust">
        <div className="tp">
          <div className="tp-ico">🔒</div>
          <div className="tp-content">
            <strong>100% Genuine Medicines</strong>
            <p>Sourced directly from verified brands.</p>
          </div>
        </div>
        <div className="tp">
          <div className="tp-ico">👨‍⚕️</div>
          <div className="tp-content">
            <strong>Verified Pharmacists</strong>
            <p>Expertly checked before every dispatch.</p>
          </div>
        </div>
        <div className="tp">
          <div className="tp-ico">⚡</div>
          <div className="tp-content">
            <strong>30-min Express Delivery</strong>
            <p>Lightning fast delivery at your doorstep.</p>
          </div>
        </div>
        <div className="tp">
          <div className="tp-ico">🛡️</div>
          <div className="tp-content">
            <strong>SSL Encrypted Checkout</strong>
            <p>Your payment data is fully secure.</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="sec">
        <div className="sec-hd">
          <div>
            <span className="eyebrow">Shop by category</span>
            <h2 className="sec-title">Popular Healthcare Needs</h2>
          </div>
          <Link to="/products" className="see-all">Browse all →</Link>
        </div>

        <div className="cats">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <Link key={cat.id} to={`/products?cat=${cat.id}`} className="cat">
              <div className="cat-ico" style={{ overflow: 'hidden', padding: '4px' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Medicines Grid */}
      <section className="sec sec-alt">
        <div className="sec-hd">
          <div>
            <span className="eyebrow">Top choices</span>
            <h2 className="sec-title">Popular Essential Medicines</h2>
          </div>
          <Link to="/products" className="see-all">Explore all →</Link>
        </div>

        <div className="pgrid">
          {PRODUCTS.slice(0, 6).map((p) => {
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
      </section>

      {/* Health Tools Strip */}
      <section className="sec">
        <div className="sec-hd">
          <div>
            <span className="eyebrow">Interactive Features</span>
            <h2 className="sec-title">Smart Health Tools</h2>
          </div>
          <Link to="/tools" className="see-all">All tools →</Link>
        </div>

        <div className="tools-strip">
          <div className="tool-card" onClick={() => navigate('/tools#pill')}>
            <div className="tool-ico" style={{ background: '#e8f5f0', color: '#0a5c44' }}>🔍</div>
            <h3>Pill Identifier</h3>
            <p>Identify unknown tablets by shape, color, and imprint code.</p>
            <div className="tool-arr">→</div>
          </div>

          <div className="tool-card" onClick={() => navigate('/tools#interact')}>
            <div className="tool-ico" style={{ background: '#fff4e6', color: '#c05800' }}>⚠️</div>
            <h3>Drug Interaction Checker</h3>
            <p>Check if combining your medicines is safe before taking them.</p>
            <div className="tool-arr">→</div>
          </div>

          <div className="tool-card" onClick={() => navigate('/tools#dose')}>
            <div className="tool-ico" style={{ background: '#f0f4ff', color: '#4c6ef5' }}>🧮</div>
            <h3>Dosage Calculator</h3>
            <p>Calculate accurate weight-based pediatric dosage for kids.</p>
            <div className="tool-arr">→</div>
          </div>

          <div className="tool-card" onClick={() => navigate('/upload-prescription')}>
            <div className="tool-ico" style={{ background: '#f0fff4', color: '#2f9e44' }}>📋</div>
            <h3>Upload Rx</h3>
            <p>Upload doctor's prescription for quick verification & delivery.</p>
            <div className="tool-arr">→</div>
          </div>
        </div>
      </section>

      {/* Prescription Callout Banner */}
      <section className="rx-cta">
        <div className="rx-in">
          <div className="rx-l">
            <div className="rx-emoji">📋</div>
            <div>
              <h2>Have a prescription?</h2>
              <p>Upload in seconds — pharmacists verify and arrange delivery</p>
              <Link to="/upload-prescription" className="btn-rx-cta">Upload Prescription →</Link>
            </div>
          </div>
          <div className="rx-feats">
            <div className="rx-feat">
              <span>⚡</span>
              <div>
                <b>Fast Processing</b>
                <small>Under 30 minutes</small>
              </div>
            </div>
            <div className="rx-feat">
              <span>👨‍⚕️</span>
              <div>
                <b>Expert Review</b>
                <small>Certified pharmacists</small>
              </div>
            </div>
            <div className="rx-feat">
              <span>🔒</span>
              <div>
                <b>100% Private</b>
                <small>Your data is safe</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="sec">
        <div className="sec-hd" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '36px' }}>
          <div>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="sec-title">India trusts CureNest</h2>
          </div>
        </div>

        <div className="why-grid">
          <Link to="/feature/licensed-pharmacy" className="w-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div className="w-ico" style={{ background: '#e8f5f0', color: '#0a5c44' }}>🏥</div>
            <h3>Licensed Pharmacy</h3>
            <p>Certified and regulated by the Pharmacy Council of India</p>
          </Link>
          <Link to="/feature/gst-invoice" className="w-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div className="w-ico" style={{ background: '#f0fff4', color: '#2f9e44' }}>🧾</div>
            <h3>GST Invoice</h3>
            <p>Official tax invoice with every order for your records</p>
          </Link>
          <Link to="/feature/quality-checked" className="w-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div className="w-ico" style={{ background: '#f0f4ff', color: '#4c6ef5' }}>🔬</div>
            <h3>Quality Checked</h3>
            <p>All medicines authenticated and temperature-monitored</p>
          </Link>
          <Link to="/feature/live-tracking" className="w-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div className="w-ico" style={{ background: '#fffbf0', color: '#f59f00' }}>📱</div>
            <h3>Live Tracking</h3>
            <p>Track your order in real-time from pharmacy to door</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
