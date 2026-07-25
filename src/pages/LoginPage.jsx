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
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #23344e 0%, #182538 55%, #0e1521 100%)',
        padding: '44px 52px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{
          position: 'absolute', width: 420, height: 420,
          border: '1.5px solid rgba(255,255,255,.06)', borderRadius: '50%',
          right: -100, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 220, height: 220,
          border: '1.5px solid rgba(255,255,255,.04)', borderRadius: '50%',
          right: 60, bottom: -60, pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 42, height: 42,
            background: 'rgba(255,255,255,.14)',
            border: '1.5px solid rgba(255,255,255,.22)',
            borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Serif Display', serif",
            fontSize: 17, color: 'white', letterSpacing: -1,
          }}>CN</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'rgba(255,255,255,.95)' }}>
            Cure<em style={{ color: '#8aa8cc', fontStyle: 'normal' }}>Nest</em>
          </span>
        </Link>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '52px 0 32px', position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.8px', color: '#8aa8cc', marginBottom: 18,
          }}>🏥 Trusted Healthcare</span>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 48, lineHeight: 1.07, color: 'white', margin: '0 0 18px',
          }}>
            Your health,<br />
            <em style={{ color: '#8aa8cc', fontStyle: 'italic' }}>our priority.</em>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.62)', lineHeight: 1.75, margin: '0 0 38px', maxWidth: 360 }}>
            Sign in to access your orders, prescriptions, exclusive deals
            on 200+ medicines, and free health tools — all in one place.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 44 }}>
            {features.map((f) => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                  background: 'rgba(255,255,255,.08)',
                  border: '1px solid rgba(255,255,255,.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
                }}>{f.icon}</div>
                <div>
                  <strong style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'rgba(255,255,255,.92)', marginBottom: 2 }}>{f.title}</strong>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{f.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating pill card */}
          <div style={{
            background: 'rgba(255,255,255,.08)',
            border: '1.5px solid rgba(255,255,255,.14)',
            borderRadius: 16, padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28 }}>💊</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'white' }}>Paracetamol 500mg</strong>
                <small style={{ fontSize: 12, color: 'rgba(255,255,255,.48)' }}>₹38 · 15% off · In Stock</small>
              </div>
              <div style={{
                marginLeft: 'auto',
                background: 'rgba(34,197,94,.18)', color: '#4ade80',
                fontSize: 11, fontWeight: 700, padding: '4px 10px',
                borderRadius: 50, border: '1px solid rgba(74,222,128,.28)',
              }}>✓ Saved</div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', position: 'relative', zIndex: 1 }}>
          © 2025 CureNest. All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div style={{
        background: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: '#2d2d2d', margin: '0 0 6px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: '#555', margin: 0 }}>Sign in to your CureNest account</p>
          </div>

          <SignIn
            signUpUrl="/register"
            fallbackRedirectUrl="/"
            appearance={{
              elements: {
                rootBox: { width: '100%' },
                card: { boxShadow: 'none', border: 'none', padding: 0, background: 'transparent', width: '100%' },
                headerTitle: { display: 'none' },
                headerSubtitle: { display: 'none' },
                logoBox: { display: 'none' },
                socialButtonsBlockButton: {
                  border: '1.5px solid #dcdcd9',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: 'white',
                },
                formFieldInput: {
                  border: '2px solid #dcdcd9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  padding: '11px 15px',
                },
                formButtonPrimary: {
                  background: 'linear-gradient(135deg, #23344e, #182538)',
                  borderRadius: '50px',
                  fontSize: '15px',
                  fontWeight: '700',
                  padding: '13px',
                },
                footerActionLink: { color: '#23344e', fontWeight: '700' },
                footer: { background: 'transparent' },
              },
            }}
          />

          <p style={{ textAlign: 'center', fontSize: 14, color: '#555', marginTop: 18 }}>
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
