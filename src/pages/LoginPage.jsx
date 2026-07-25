import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ₹299' },
  { icon: '💊', title: '200+ Medicines', sub: '100% genuine & certified' },
  { icon: '🔬', title: 'Free Health Tools', sub: 'BMI, dose calculator & more' },
  { icon: '🔒', title: 'Secure Checkout', sub: 'SSL encrypted payments' },
];

export default function LoginPage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden',
    }}>
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div style={{
        width: '45%',
        flexShrink: 0,
        background: 'linear-gradient(160deg, #23344e 0%, #182538 55%, #0e1521 100%)',
        padding: '44px 52px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', width: 420, height: 420, border: '1.5px solid rgba(255,255,255,.06)', borderRadius: '50%', right: -100, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, border: '1.5px solid rgba(255,255,255,.04)', borderRadius: '50%', right: 60, bottom: -60, pointerEvents: 'none' }} />

        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,.14)', border: '1.5px solid rgba(255,255,255,.22)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: 17, color: 'white', letterSpacing: -1 }}>CN</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'rgba(255,255,255,.95)' }}>
            Cure<em style={{ color: '#8aa8cc', fontStyle: 'normal' }}>Nest</em>
          </span>
        </Link>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.8px', color: '#8aa8cc', marginBottom: 20 }}>🏥 Trusted Healthcare</span>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, lineHeight: 1.1, color: 'white', margin: '0 0 16px' }}>
            Your health,<br />
            <em style={{ color: '#8aa8cc', fontStyle: 'italic' }}>our priority.</em>
          </h1>

          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 340 }}>
            Sign in to access your orders, prescriptions, and exclusive deals on 200+ medicines.
          </p>

          {features.map((f) => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{f.icon}</div>
              <div>
                <strong style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'rgba(255,255,255,.9)', marginBottom: 2 }}>{f.title}</strong>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.44)' }}>{f.sub}</span>
              </div>
            </div>
          ))}

          {/* Floating pill card */}
          <div style={{ marginTop: 10, background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(255,255,255,.14)', borderRadius: 14, padding: '13px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26 }}>💊</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'white' }}>Paracetamol 500mg</strong>
                <small style={{ fontSize: 11.5, color: 'rgba(255,255,255,.46)' }}>₹38 · 15% off · In Stock</small>
              </div>
              <div style={{ marginLeft: 'auto', background: 'rgba(34,197,94,.18)', color: '#4ade80', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50, border: '1px solid rgba(74,222,128,.28)', whiteSpace: 'nowrap' }}>✓ Saved</div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.22)', position: 'relative', zIndex: 1 }}>© 2025 CureNest. All rights reserved.</p>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div style={{
        flex: 1,
        background: '#f8f9fb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Header */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#1a202c', margin: '0 0 8px' }}>Welcome back</h2>
            <p style={{ fontSize: 14.5, color: '#718096', margin: 0 }}>Sign in to your CureNest account</p>
          </div>

          {/* Clerk widget — centered, no card box */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SignIn
              signUpUrl="/register"
              fallbackRedirectUrl="/"
              appearance={{
                layout: { socialButtonsVariant: 'blockButton' },
                elements: {
                  rootBox: { width: '100%', maxWidth: '400px' },
                  card: {
                    boxShadow: '0 4px 32px rgba(0,0,0,.08)',
                    border: '1px solid #e8ecf0',
                    borderRadius: '16px',
                    padding: '28px 28px',
                    background: 'white',
                    width: '100%',
                  },
                  headerTitle: { display: 'none' },
                  headerSubtitle: { display: 'none' },
                  logoBox: { display: 'none' },
                  socialButtonsBlockButton: {
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '14px',
                    background: 'white',
                  },
                  dividerText: { color: '#a0aec0' },
                  formFieldLabel: { fontSize: '13px', fontWeight: '600', color: '#374151' },
                  formFieldInput: {
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    padding: '11px 14px',
                    background: 'white',
                  },
                  formButtonPrimary: {
                    background: 'linear-gradient(135deg, #23344e, #182538)',
                    borderRadius: '50px',
                    fontSize: '15px',
                    fontWeight: '700',
                    padding: '13px',
                    boxShadow: '0 4px 14px rgba(35,52,78,.35)',
                  },
                  footerActionLink: { color: '#23344e', fontWeight: '700' },
                  footer: { background: 'transparent' },
                  identityPreviewEditButton: { color: '#23344e' },
                },
              }}
            />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#718096', marginTop: 20 }}>
            New to CureNest?{' '}
            <Link to="/register" style={{ color: '#23344e', fontWeight: 700, textDecoration: 'none' }}>
              Create account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
