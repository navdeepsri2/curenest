import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="f-top">
        <div className="f-brand">
          <div className="logo">
            <div className="logo-box">CN</div>
            <span className="logo-text" style={{ color: '#fff' }}>Cure<em style={{ color: '#5eead4' }}>Nest</em></span>
          </div>
          <p>India's trusted online pharmacy delivering genuine medicines with expert care.</p>
          <div className="f-badges">
            <span className="f-badge">🔒 SSL Secured</span>
            <span className="f-badge">✅ ISO Certified</span>
          </div>
        </div>

        <div className="f-col">
          <h4>Shop</h4>
          <Link to="/products">All Medicines</Link>
          <Link to="/products?cat=1">Vitamins</Link>
          <Link to="/products?cat=3">Skincare</Link>
          <Link to="/products?cat=10">Ayurvedic</Link>
          <Link to="/upload-prescription">Upload Rx</Link>
        </div>

        <div className="f-col">
          <h4>Tools</h4>
          <Link to="/tools#pill">Pill Identifier</Link>
          <Link to="/tools#interact">Drug Interactions</Link>
          <Link to="/tools#dose">Dosage Calculator</Link>
        </div>

        <div className="f-col">
          <h4>Contact Us</h4>
          <a href="mailto:navdeep976@gmail.com" className="f-mail">📧 navdeep976@gmail.com</a>
          <Link to="/orders">My Orders</Link>
          <a href="#">Privacy Policy</a>
        </div>
      </div>

      <div className="f-bot">
        <span>© CureNest — All rights reserved</span>
        <span>
          <a href="mailto:navdeep976@gmail.com" style={{ color: '#5eead4' }}>navdeep976@gmail.com</a>
        </span>
      </div>
    </footer>
  );
}
