import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';
import { Bike, ArrowLeft, RefreshCw, CheckCircle2, MapPin, Phone, AlertCircle } from 'lucide-react';

const AssignedOrders = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await deliveryService.getMyDeliveries();
      setDeliveries(data || []);
    } catch (err) {
      console.error('Failed to load assigned deliveries:', err);
      setError('Could not load assigned deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      await deliveryService.updateStatus(deliveryId, status);
      await fetchDeliveries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update delivery status.');
    }
  };

  const activeDeliveries = deliveries.filter(
    (d) => d.deliveryStatus !== 'DELIVERED' && d.deliveryStatus !== 'CANCELLED'
  );

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/delivery/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Assigned Deliveries</h1>
          <p style={{ color: 'var(--text-muted)' }}>Orders awaiting pickup and active transit</p>
        </div>

        <button onClick={fetchDeliveries} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading active delivery list...</p>
      ) : activeDeliveries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '480px', margin: '0 auto' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1.25rem' }} />
          <h3>No Active Deliveries</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>You're all caught up! Accept open deliveries from the dashboard.</p>
          <Link to="/delivery/dashboard" className="btn btn-primary">Find New Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeDeliveries.map((delivery) => {
            const order = delivery.order || {};
            return (
              <div key={delivery.id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '1.2rem' }}>{order.orderNumber}</strong>
                      <span className="badge badge-warning">{delivery.deliveryStatus}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Restaurant: <strong>{order.restaurant?.name}</strong>
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Cash/Payment to Collect</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      ₹{Number(order.grandTotal).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Method: {order.payment?.paymentMethod || 'Online'}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {/* Restaurant details */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                      Step 1: Pick Up
                    </span>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{order.restaurant?.name}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span>{order.restaurant?.address}</span>
                    </div>
                    {order.restaurant?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Phone size={14} />
                        <span>{order.restaurant?.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer details */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--success)', display: 'block', marginBottom: '0.35rem' }}>
                      Step 2: Drop Off
                    </span>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{order.customer?.name}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                      <MapPin size={14} color="var(--success)" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    {order.customer?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Phone size={14} />
                        <span>{order.customer?.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Package Items:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                    {(order.items || []).map((item, idx) => (
                      <span key={idx} style={{ background: '#fff', border: '1px solid var(--border-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.825rem', fontWeight: 600 }}>
                        {item.quantity}x {item.foodName || item.food?.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  {delivery.deliveryStatus === 'ASSIGNED' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery.id, 'OUT_FOR_DELIVERY')}
                      className="btn btn-primary"
                    >
                      <Bike size={16} />
                      <span>Picked Up & In Transit</span>
                    </button>
                  )}

                  {delivery.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery.id, 'DELIVERED')}
                      className="btn btn-secondary"
                    >
                      <CheckCircle2 size={16} />
                      <span>Completed / Delivered to Customer</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
