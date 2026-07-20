import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function OrdersPage() {
  const { orders } = useStore();

  const sc = { pending: 'sp-p', confirmed: 'sp-c', delivered: 'sp-d' };
  const si = { pending: '⏳', confirmed: '✅', delivered: '🚚' };

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / My Orders
        </div>
        <h1>📦 My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '26px 44px' }}>
        {orders.length === 0 ? (
          <div className="empty" style={{ textAlign: 'center', padding: '60px' }}>
            <div className="e-ico" style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>No orders yet</h3>
            <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '20px' }}>You haven't placed any orders</p>
            <Link to="/products" className="btn-g">Shop Now</Link>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.order_id} className="o-card">
              <div className="o-hd">
                <div>
                  <div className="o-id">Order #{o.order_id}</div>
                  <div className="o-date">{o.date}</div>
                </div>
                <span className={`spill ${sc[o.status] || 'sp-p'}`}>
                  {si[o.status] || '⏳'} {o.status}
                </span>
              </div>

              <div className="o-body">
                {(o.items || []).map((i, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '9px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--g4)',
                        borderRadius: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                      }}
                    >
                      💊
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{i.product_name || i.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--fog)' }}>
                        Qty: {i.qty} × ₹{i.price}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--g)' }}>
                      ₹{i.price * i.qty}
                    </div>
                  </div>
                ))}

                <div className="o-total">Total: ₹{o.total_amount}</div>

                <div style={{ marginTop: '11px' }}>
                  <span style={{ background: 'var(--bg)', padding: '5px 11px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>
                    💳 Cash on Delivery / UPI
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
