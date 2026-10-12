import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';
import { CheckCircle2, ArrowLeft, RefreshCw, Calendar, MapPin, DollarSign } from 'lucide-react';

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getMyDeliveries();
      // Filter for delivered
      setDeliveries((data || []).filter((d) => d.deliveryStatus === 'DELIVERED'));
    } catch (err) {
      console.error('Failed to load delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalEarnings = deliveries.length * 40; // ₹40 delivery fee per completed order

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/delivery/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Delivery History</h1>
          <p style={{ color: 'var(--text-muted)' }}>Archive of your completed customer deliveries</p>
        </div>

        <button onClick={fetchHistory} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderColor: '#bbf7d0' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>Total Deliveries Completed</span>
          <h2 style={{ fontSize: '2rem', color: '#14532d', fontWeight: 800 }}>{deliveries.length} Trips</h2>
        </div>
        <div style={{ height: '40px', width: '1px', background: '#86efac' }} />
        <div>
          <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>Estimated Rider Earnings</span>
          <h2 style={{ fontSize: '2rem', color: '#14532d', fontWeight: 800 }}>₹{totalEarnings.toFixed(2)}</h2>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading history...</p>
      ) : deliveries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '480px', margin: '0 auto' }}>
          <CheckCircle2 size={48} color="var(--text-light)" style={{ margin: '0 auto 1.25rem' }} />
          <h3>No Past Deliveries</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Your completed deliveries will appear here.</p>
          <Link to="/delivery/dashboard" className="btn btn-primary">Go to Active Hub</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Restaurant</th>
                  <th>Destination</th>
                  <th>Delivered At</th>
                  <th>Total Amount</th>
                  <th style={{ textAlign: 'right' }}>Rider Payout</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((del) => {
                  const order = del.order || {};
                  return (
                    <tr key={del.id}>
                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>{order.orderNumber}</strong>
                      </td>
                      <td>{order.restaurant?.name}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <MapPin size={13} color="var(--primary)" />
                          <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.deliveryAddress}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {del.deliveryTime ? new Date(del.deliveryTime).toLocaleString() : 'Recently'}
                        </div>
                      </td>
                      <td>₹{Number(order.grandTotal).toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-success">+₹40.00</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
