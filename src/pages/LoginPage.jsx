import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div className="auth-split">
        <div className="auth-l">
          <h2>
            Your health,<br />
            <em style={{ color: 'var(--g)', fontStyle: 'italic' }}>our priority.</em>
          </h2>
          <p>Login to access orders, prescriptions, and exclusive deals on 200+ medicines.</p>
          <div className="a-feat"><span>🚚</span> Free delivery above ₹299</div>
          <div className="a-feat"><span>💊</span> 200+ genuine medicines</div>
          <div className="a-feat"><span>🔬</span> Free health tools</div>
          <div className="a-feat"><span>🔒</span> 100% secure checkout</div>
        </div>

        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <SignIn signUpUrl="/register" fallbackRedirectUrl="/" />
        </div>
      </div>
    </div>
  );
}
