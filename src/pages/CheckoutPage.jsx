import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useStore } from '../context/StoreContext';
import RazorpayMock from '../components/RazorpayMock';

export default function CheckoutPage() {
  const { cart, cartSubtotal, placeOrder } = useStore();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const [formData, setFormData] = useState({
    fn: user ? user.fullName || user.primaryEmailAddress?.emailAddress : '',
    ph: '',
    a1: '',
    a2: '',
    cy: 'Delhi',
    pn: '110001',
    pay: 'cod',
  });

  useEffect(() => {
    if (user && !formData.fn) {
      setFormData(prev => ({ ...prev, fn: user.fullName || user.primaryEmailAddress?.emailAddress || '' }));
    }
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  }

  const [isPlaced, setIsPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [showRazorpay, setShowRazorpay] = useState(false);

  const deliveryFee = cartSubtotal >= 299 || cartSubtotal === 0 ? 0 : 50;
  const grandTotal = cartSubtotal + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.fn || !formData.ph || !formData.a1) {
      alert('Please fill out all required delivery details.');
      return;
    }

    if (formData.pay === 'cod') {
      finalizeOrder('cod', null);
    } else {
      setShowRazorpay(true);
    }
  };

  const finalizeOrder = (method, paymentId) => {
    const orderId = placeOrder({
      total: grandTotal,
      shipping: formData,
      paymentMethod: method,
      paymentId: paymentId,
    });
    setPlacedOrderId(orderId);
    setIsPlaced(true);
  };

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / Checkout
        </div>
        <h1>Checkout</h1>
      </div>

      <div className="co-l">
        <div style={{ flex: 1 }}>
          <form onSubmit={handlePlaceOrder}>
            <div className="co-sec">
              <h3>
                <span className="step-n">1</span> Delivery Address
              </h3>
              <div className="f2">
                <div className="fg">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fn}
                    onChange={(e) => setFormData({ ...formData, fn: e.target.value })}
                    placeholder="Rahul Kumar"
                  />
                </div>
                <div className="fg">
                  <label>Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div className="fg">
                <label>Address Line 1</label>
                <input
                  type="text"
                  required
                  value={formData.a1}
                  onChange={(e) => setFormData({ ...formData, a1: e.target.value })}
                  placeholder="House no, Street name"
                />
              </div>
              <div className="fg">
                <label>Address Line 2 (optional)</label>
                <input
                  type="text"
                  value={formData.a2}
                  onChange={(e) => setFormData({ ...formData, a2: e.target.value })}
                  placeholder="Area, Landmark"
                />
              </div>
              <div className="f2">
                <div className="fg">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.cy}
                    onChange={(e) => setFormData({ ...formData, cy: e.target.value })}
                    placeholder="Delhi"
                  />
                </div>
                <div className="fg">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={formData.pn}
                    onChange={(e) => setFormData({ ...formData, pn: e.target.value })}
                    placeholder="110001"
                    maxLength="6"
                  />
                </div>
              </div>
            </div>

            <div className="co-sec">
              <h3>
                <span className="step-n">2</span> Payment Method
              </h3>
              <div
                className={`pay-opt ${formData.pay === 'cod' ? 'sel' : ''}`}
                onClick={() => setFormData({ ...formData, pay: 'cod' })}
              >
                <input type="radio" name="pay" value="cod" checked={formData.pay === 'cod'} readOnly />
                <span style={{ fontSize: '21px' }}>💵</span>
                <div>
                  <strong>Cash on Delivery</strong>
                  <br />
                  <small style={{ color: 'var(--slate)' }}>Pay when order arrives</small>
                </div>
              </div>

              <div
                className={`pay-opt ${formData.pay === 'upi' ? 'sel' : ''}`}
                onClick={() => setFormData({ ...formData, pay: 'upi' })}
              >
                <input type="radio" name="pay" value="upi" checked={formData.pay === 'upi'} readOnly />
                <span style={{ fontSize: '21px' }}>📱</span>
                <div>
                  <strong>UPI / GPay / PhonePe</strong>
                  <br />
                  <small style={{ color: 'var(--slate)' }}>Pay using UPI</small>
                </div>
              </div>

              <div
                className={`pay-opt ${formData.pay === 'card' ? 'sel' : ''}`}
                onClick={() => setFormData({ ...formData, pay: 'card' })}
              >
                <input type="radio" name="pay" value="card" checked={formData.pay === 'card'} readOnly />
                <span style={{ fontSize: '21px' }}>💳</span>
                <div>
                  <strong>Credit / Debit Card</strong>
                  <br />
                  <small style={{ color: 'var(--slate)' }}>All cards accepted</small>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-g" style={{ width: '100%', marginTop: '14px', padding: '13px' }}>
              Place Order 🎉
            </button>
          </form>
        </div>

        <div className="sbox" style={{ width: '300px' }}>
          <div className="s-ttl">Order Summary</div>
          <div style={{ marginBottom: '13px', fontSize: '13px', color: 'var(--slate)' }}>
            {cart.map((item) => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', paddingBottom: '7px', borderBottom: '1px solid var(--border)' }}>
                <span>💊 {item.name} ×{item.qty}</span>
                <span style={{ fontWeight: 700 }}>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="srow">
            <span>Subtotal</span>
            <span>₹{cartSubtotal}</span>
          </div>
          <div className="srow">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE</span> : `₹${deliveryFee}`}</span>
          </div>
          <div className="srow tot">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--fog)', textAlign: 'center', marginTop: '10px' }}>
            🔒 Secure & encrypted checkout
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {isPlaced && (
        <div className="succ-ov show">
          <div className="succ-card">
            <div style={{ fontSize: '64px', marginBottom: '13px' }}>🎉</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', marginBottom: '7px' }}>Order Placed!</h2>
            <p style={{ color: 'var(--slate)', marginBottom: '5px' }}>Your order is confirmed.</p>
            <p style={{ color: 'var(--g)', fontWeight: 800, fontSize: '18px', marginBottom: '20px' }}>
              Order #{placedOrderId}
            </p>
            <p style={{ color: 'var(--fog)', fontSize: '13px', marginBottom: '20px' }}>
              Express Delivery in 30 minutes
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/orders')} className="btn-g">View Orders</button>
              <button onClick={() => navigate('/')} className="btn-o">Continue Shopping</button>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Mock UI */}
      {showRazorpay && (
        <RazorpayMock 
          amount={grandTotal} 
          contact={formData.ph} 
          onSuccess={(res) => {
            setShowRazorpay(false);
            finalizeOrder(formData.pay, res.razorpay_payment_id);
          }} 
          onClose={() => setShowRazorpay(false)} 
        />
      )}
    </div>
  );
}
