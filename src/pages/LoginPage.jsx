import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

export default function LoginPage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#111113',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.04) 0%, transparent 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '24px',
    }}>
      <SignIn
        signUpUrl="/register"
        fallbackRedirectUrl="/"
        appearance={{
          baseTheme: dark,
          variables: {
            colorBackground: '#1c1c1f',
            colorInputBackground: '#2a2a2e',
            colorInputText: '#ffffff',
            colorText: '#ffffff',
            colorTextSecondary: '#a1a1aa',
            colorPrimary: '#ffffff',
            colorNeutral: '#ffffff',
            borderRadius: '12px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
          elements: {
            rootBox: { width: '100%', maxWidth: '460px' },
            card: {
              background: '#1c1c1f',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: '20px',
              boxShadow: '0 24px 80px rgba(0,0,0,.6)',
              padding: '36px 36px 24px',
              width: '100%',
            },
            headerTitle: {
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            headerSubtitle: {
              color: '#a1a1aa',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            logoBox: { display: 'none' },
            socialButtonsBlockButton: {
              background: '#2a2a2e',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              padding: '12px',
              transition: 'background .2s',
            },
            socialButtonsBlockButtonText: {
              color: '#ffffff',
              fontWeight: '600',
            },
            dividerLine: { background: 'rgba(255,255,255,.08)' },
            dividerText: { color: '#52525b', fontSize: '13px' },
            formFieldLabel: {
              color: '#e4e4e7',
              fontSize: '13.5px',
              fontWeight: '600',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            formFieldInput: {
              background: '#2a2a2e',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              padding: '12px 14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            formButtonPrimary: {
              background: '#ffffff',
              color: '#111113',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              padding: '13px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: 'none',
            },
            footerActionText: { color: '#71717a', fontSize: '14px' },
            footerActionLink: {
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '14px',
            },
            footer: {
              background: 'transparent',
              borderTop: '1px solid rgba(255,255,255,.06)',
              paddingTop: '16px',
            },
            identityPreviewText: { color: '#ffffff' },
            identityPreviewEditButton: { color: '#a1a1aa' },
            alertText: { color: '#fca5a5' },
          },
        }}
      />
    </div>
  );
}
