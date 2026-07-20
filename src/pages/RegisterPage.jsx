import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    if (password !== confirmPw) {
      setErrorMsg('Passwords do not match');
      return;
    }

    loginUser({ name: name, email: email });
    navigate('/');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div className="fcard" style={{ maxWidth: '500px', width: '100%' }}>
        <h2>Create Account 🎉</h2>
        <p className="sub">Join and access 200+ genuine medicines & free health tools</p>

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

        <form onSubmit={handleRegister}>
          <div className="f2">
            <div className="fg">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="Rahul Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="9876543210"
                maxLength="10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

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

          <div className="f2">
            <div className="fg">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Confirm</label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && <div className="f-err" style={{ display: 'block', marginBottom: '12px' }}>❌ {errorMsg}</div>}

          <button type="submit" className="btn-g f-sub">
            Create My Account
          </button>
        </form>

        <div className="f-link" style={{ marginTop: '16px' }}>
          Already have an account? <Link to="/login">Login →</Link>
        </div>
      </div>
    </div>
  );
}
