import React, { useState, useEffect } from 'react';

export default function RazorpayMock({ amount, email, contact, onSuccess, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Auto-close on escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handlePay = () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setStep(2); // Success screen
      setTimeout(() => {
        onSuccess({
          razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 15),
          razorpay_order_id: 'order_' + Math.random().toString(36).substring(2, 15),
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="rzp-overlay">
      <div className="rzp-modal">
        {/* Header */}
        <div className="rzp-header">
          <div className="rzp-brand">
            <div className="rzp-logo">CN</div>
            <div className="rzp-title">
              CureNest Pharmacy
              <div className="rzp-subtitle">Order Payment</div>
            </div>
          </div>
          <button className="rzp-close" onClick={onClose} disabled={loading}>✕</button>
        </div>

        {/* Content */}
        <div className="rzp-body">
          {step === 1 ? (
            <>
              <div className="rzp-contact">
                <div>+91 {contact}</div>
                <div>{email || 'user@example.com'}</div>
              </div>

              <div className="rzp-amount-sec">
                <span style={{ fontSize: '14px', color: '#888' }}>Amount to pay</span>
                <div className="rzp-amt">₹{amount.toFixed(2)}</div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px', fontSize: '15px' }}>Scan to Pay</p>
                <img src="/images/my_qr_code.jpg" alt="UPI QR Code" style={{ width: '200px', height: '200px', borderRadius: '8px', objectFit: 'contain', margin: '0 auto', display: 'block', background: '#fff', padding: '10px' }} />
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px', userSelect: 'all', background: '#e2e8f0', padding: '6px', borderRadius: '4px', display: 'inline-block' }}>UPI ID: 9908923147-2@ybl</p>
              </div>

              <div className="rzp-options">
                <div className="rzp-opt" onClick={handlePay}>
                  <span className="rzp-opt-icon">✅</span>
                  <div className="rzp-opt-text" style={{ flex: 1, textAlign: 'center' }}>
                    <strong>I have completed the payment</strong>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="rzp-loader-ov">
                  <div className="rzp-spinner"></div>
                  <p>Processing Payment...</p>
                  <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Please do not close this window</p>
                </div>
              )}
            </>
          ) : (
            <div className="rzp-success">
              <div className="rzp-tick">✓</div>
              <h3>Payment Successful</h3>
              <p>Redirecting to merchant...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rzp-footer">
          🔒 Secured by <strong>Razorpay</strong>
        </div>
      </div>
    </div>
  );
}
