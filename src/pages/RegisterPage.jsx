import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div style={{ maxWidth: '500px', width: '100%', margin: '0 auto' }}>
        <SignUp signInUrl="/login" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}
