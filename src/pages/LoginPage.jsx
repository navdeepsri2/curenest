import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="login-page-root">
      {/* Animated background blobs */}
      <div className="login-bg">
        <div className="login-blob lb1" />
        <div className="login-blob lb2" />
        <div className="login-blob lb3" />
      </div>

      <div className="login-container">
        {/* Left panel – brand story */}
        <div className="login-left">
          {/* Logo */}
          <Link to="/" className="login-logo">
            <div className="login-logo-box">CN</div>
            <span className="login-logo-text">Cure<em>Nest</em></span>
          </Link>

          <div className="login-left-body">
            <span className="login-eyebrow">🏥 Trusted Healthcare</span>

            <h1 className="login-headline">
              Your health,<br />
              <em>our priority.</em>
            </h1>

            <p className="login-sub">
              Sign in to access your orders, prescriptions, exclusive deals
              on 200+ medicines, and free health tools — all in one place.
            </p>

            <div className="login-features">
              <div className="login-feat">
                <div className="login-feat-ico">🚚</div>
                <div>
                  <strong>Free Delivery</strong>
                  <span>On orders above ₹299</span>
                </div>
              </div>
              <div className="login-feat">
                <div className="login-feat-ico">💊</div>
                <div>
                  <strong>200+ Medicines</strong>
                  <span>100% genuine &amp; certified</span>
                </div>
              </div>
              <div className="login-feat">
                <div className="login-feat-ico">🔬</div>
                <div>
                  <strong>Free Health Tools</strong>
                  <span>BMI, dose calculator &amp; more</span>
                </div>
              </div>
              <div className="login-feat">
                <div className="login-feat-ico">🔒</div>
                <div>
                  <strong>Secure Checkout</strong>
                  <span>SSL encrypted payments</span>
                </div>
              </div>
            </div>

            {/* Decorative pill card */}
            <div className="login-card-preview">
              <div className="lcp-inner">
                <span className="lcp-emoji">💊</span>
                <div>
                  <strong>Paracetamol 500mg</strong>
                  <small>₹38 · 15% off · In Stock</small>
                </div>
                <div className="lcp-badge">✓ Saved</div>
              </div>
            </div>
          </div>

          <div className="login-left-footer">
            <p>© 2025 CureNest. All rights reserved.</p>
          </div>
        </div>

        {/* Right panel – Clerk SignIn widget */}
        <div className="login-right">
          <div className="login-right-inner">
            <div className="login-right-header">
              <h2>Welcome back</h2>
              <p>Sign in to your CureNest account</p>
            </div>

            <div className="login-clerk-wrap">
              <SignIn
                signUpUrl="/register"
                fallbackRedirectUrl="/"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: {
                      boxShadow: 'none',
                      border: 'none',
                      padding: '0',
                      background: 'transparent',
                    },
                    headerTitle: { display: 'none' },
                    headerSubtitle: { display: 'none' },
                    socialButtonsBlockButton: {
                      border: '1.5px solid #dcdcd9',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                    },
                    formFieldInput: {
                      border: '2px solid #dcdcd9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      padding: '11px 15px',
                    },
                    formButtonPrimary: {
                      background: 'linear-gradient(135deg,#23344e,#182538)',
                      borderRadius: '50px',
                      fontSize: '15px',
                      fontWeight: '700',
                      padding: '13px',
                      letterSpacing: '0.3px',
                    },
                    footerActionLink: {
                      color: '#23344e',
                      fontWeight: '700',
                    },
                  },
                }}
              />
            </div>

            <p className="login-register-prompt">
              New to CureNest?{' '}
              <Link to="/register" className="login-register-link">
                Create account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
