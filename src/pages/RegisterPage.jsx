import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#f4f4f2',
      backgroundImage: 'radial-gradient(ellipse at 60% 0%, rgba(35,52,78,.06) 0%, transparent 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '24px',
      overflowY: 'auto',
    }}>
      {/* Home button */}
      <Link to="/" style={{
        position: 'fixed',
        top: 20,
        left: 24,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: 'white',
        border: '1.5px solid #e2e8f0',
        color: '#23344e',
        padding: '8px 16px',
        borderRadius: 50,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        transition: 'box-shadow .2s',
        zIndex: 10,
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.06)'}
      >
        ← Home
      </Link>

      <SignUp
        signInUrl="/login"
        fallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorBackground: '#ffffff',
            colorInputBackground: '#f8f9fb',
            colorInputText: '#1a202c',
            colorText: '#1a202c',
            colorTextSecondary: '#718096',
            colorPrimary: '#23344e',
            colorNeutral: '#23344e',
            borderRadius: '12px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
          elements: {
            rootBox: { width: '100%', maxWidth: '460px' },
            card: {
              background: '#ffffff',
              border: '1.5px solid #e8ecf0',
              borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(35,52,78,.1)',
              padding: '36px 36px 24px',
              width: '100%',
            },
            headerTitle: {
              color: '#1a202c',
              fontSize: '22px',
              fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            headerSubtitle: {
              color: '#718096',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            logoBox: { display: 'none' },
            socialButtonsBlockButton: {
              background: '#f8f9fb',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              color: '#1a202c',
              fontWeight: '600',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              padding: '12px',
            },
            socialButtonsBlockButtonText: {
              color: '#1a202c',
              fontWeight: '600',
            },
            dividerLine: { background: '#e8ecf0' },
            dividerText: { color: '#a0aec0', fontSize: '13px' },
            formFieldLabel: {
              color: '#374151',
              fontSize: '13.5px',
              fontWeight: '600',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            formFieldInput: {
              background: '#f8f9fb',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              color: '#1a202c',
              fontSize: '14px',
              padding: '12px 14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            formButtonPrimary: {
              background: 'linear-gradient(135deg, #23344e, #182538)',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              padding: '13px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 4px 14px rgba(35,52,78,.3)',
            },
            footerActionText: { color: '#718096', fontSize: '14px' },
            footerActionLink: {
              color: '#23344e',
              fontWeight: '700',
              fontSize: '14px',
            },
            footer: {
              background: 'transparent',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '16px',
            },
          },
        }}
      />
    </div>
  );
}
