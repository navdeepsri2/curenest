import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginUser } = useStore();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      loginUser({ name: 'Google User', email: 'user@gmail.com' });
      navigate('/');
    }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    loginUser({ name: email.split('@')[0], email: email });
    navigate('/');
  };

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

        <div className="fcard" style={{ maxWidth: '400px', width: '100%' }}>
          <h2>Welcome back 👋</h2>
          <p className="sub">Login to your CureNest account</p>

          <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
            {isGoogleLoading ? <span className="btn-spinner"></span> : (
              <svg viewBox="0 0 48 48" width="18px" height="18px">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
          
          <div className="auth-or"><span>OR</span></div>

          <form onSubmit={handleLogin}>
            <div className="fg">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="fg">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && <div className="f-err" style={{ display: 'block', marginBottom: '12px' }}>❌ {errorMsg}</div>}

            <button type="submit" className="btn-g f-sub">
              Login to Account
            </button>
          </form>

          <div className="f-link" style={{ marginTop: '16px' }}>
            Don't have an account? <Link to="/register">Create one free →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
