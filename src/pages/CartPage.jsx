import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, cartSubtotal } = useStore();
  const navigate = useNavigate();

  const getEmoji = (catId) => {
    switch (catId) {
      case 1: return '🌿';
      case 2: return '🩹';
      case 3: return '✨';
      case 4: return '🤧';
      case 5: return '🩸';
      case 6: return '❤️';
      case 10: return '🍃';
      default: return '💊';
    }
  };

  const deliveryFee = cartSubtotal >= 299 || cartSubtotal === 0 ? 0 : 50;
  const grandTotal = cartSubtotal + deliveryFee;
  const cnt = cart.length;

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / Cart
        </div>
        <h1>🛒 My Cart</h1>
        <p>{cnt > 0 ? `${cnt} item${cnt > 1 ? 's' : ''} in cart` : 'Your cart is empty'}</p>
      </div>

      <div className="cart-lay" style={{ display: 'flex', gap: '28px', maxWidth: '1060px', margin: '0 auto', padding: '30px 44px' }}>
        {cnt === 0 ? (
          <div className="empty" style={{ width: '100%', textCenter: 'center', padding: '60px' }}>
            <div className="e-ico" style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Cart is empty</h3>
            <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '20px' }}>Add medicines to get started</p>
            <Link to="/products" className="btn-g">Shop Now</Link>
          </div>
        ) : (
          <>
            <div className="cart-w" style={{ flex: 1 }}>
              {cart.map((item) => (
                <div key={item.product_id} className="citem">
                  <div className="c-img">{getEmoji(item.category_id)}</div>
                  <div style={{ flex: 1 }}>
                    <div className="c-name">{item.name}</div>
                    <div className="c-brand">{item.brand || 'Generic'}</div>
                    <div className="c-price">
                      ₹{item.price * item.qty}{' '}
                      <span style={{ fontSize: '12px', color: 'var(--fog)', fontWeight: 400 }}>
                        ₹{item.price} × {item.qty}
                      </span>
                    </div>
                  </div>
                  <div className="qr">
                    <button className="qb" onClick={() => updateCartQty(item.product_id, item.qty - 1)}>−</button>
                    <span className="qn">{item.qty}</span>
                    <button className="qb" onClick={() => updateCartQty(item.product_id, item.qty + 1)}>+</button>
                  </div>
                  <button className="rmb" onClick={() => removeFromCart(item.product_id)} title="Remove">🗑</button>
                </div>
              ))}
            </div>

            <div className="sbox">
              <div className="s-ttl">Order Summary</div>
              <div className="srow">
                <span>Subtotal ({cnt} item{cnt > 1 ? 's' : ''})</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="srow">
                <span>Delivery</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--green)' : 'inherit' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '8px', padding: '9px 11px', fontSize: '12.5px', color: '#92400e', marginBottom: '7px' }}>
                  Add <b>₹{(299 - cartSubtotal).toFixed(0)}</b> more for free delivery
                </div>
              )}
              <div className="srow tot">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-g"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '14px' }}
              >
                Proceed to Checkout →
              </button>
              <div style={{ textAlign: 'center', marginTop: '11px' }}>
                <Link to="/products" style={{ fontSize: '13px', color: 'var(--muted)' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
