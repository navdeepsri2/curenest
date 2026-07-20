import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';

export default function Navbar() {
  const { totalCartItems, user, logoutUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const getEmoji = (catId) => {
    switch (catId) {
      case 1: return '🌿';
      case 2: return '🩹';
      case 3: return '✨';
      case 4: return '🤧';
      case 5: return '🩸';
      case 6: return '❤️';
      case 10: return '🍃';
      default: return '💊';
    }
  };

  const searchHits = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 7)
    : [];

  const handleSelectProduct = (id) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/products/${id}`);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="ann">
        <div className="ann-track">
          <span>🚚 Free delivery above ₹299</span>
          <span>💊 200+ genuine medicines</span>
          <span>⚡ 30-min express delivery</span>
          <span>🔒 100% genuine products</span>
          <span>👨‍⚕️ Expert pharmacist support</span>
          <span>🚚 Free delivery above ₹299</span>
          <span>💊 200+ genuine medicines</span>
          <span>⚡ 10-min express delivery</span>
          <span>🔒 100% genuine products</span>
          <span>👨‍⚕️ Expert pharmacist support</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="nav" id="nav">
        <Link to="/" className="logo">
          <div className="logo-box">CN</div>
          <span className="logo-text">Cure<em>Nest</em></span>
        </Link>

        {/* Live Search Box */}
        <div className="srch">
          <div className="srch-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              id="si"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search medicines, brands..."
            />
            {searchQuery && (
              <button
                className="srch-x"
                style={{ display: 'block' }}
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && searchHits.length > 0 && (
            <div className="srch-drop on">
              {searchHits.map((p) => (
                <div
                  key={p.product_id}
                  className="sdrop-item"
                  onClick={() => handleSelectProduct(p.product_id)}
                >
                  <span>{getEmoji(p.category_id)} {p.name}</span>
                  <span className="sdrop-price">₹{p.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Nav Links */}
        <div className="nav-r">
          <Link to="/products" className="n-rx">💊 Medicines</Link>
          <Link to="/tools" className="n-tools">🔬 Tools</Link>

          <Link to="/cart" className="n-cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart <span className="c-dot" id="cartCount">{totalCartItems}</span>
          </Link>

          {user ? (
            <div className="u-chip">
              <div className="u-av">{user.name.charAt(0)}</div>
              <span>{user.name}</span>
              <button onClick={logoutUser} className="u-x" title="Logout">✕</button>
            </div>
          ) : (
            <Link to="/login" className="n-login">Login</Link>
          )}
        </div>
      </nav>
    </>
  );
}
