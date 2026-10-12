import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import deliveryService from '../../services/deliveryService';
import { Bike, Package, CheckCircle2, Clock, MapPin, Phone, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [mine, pending] = await Promise.all([
        deliveryService.getMyDeliveries().catch(() => []),
        deliveryService.getPending().catch(() => []),
      ]);
      setMyDeliveries(mine || []);
      setPendingDeliveries(pending || []);
    } catch (err) {
      console.error('Failed to load delivery data:', err);
      setError('Could not retrieve delivery dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimDelivery = async (orderId) => {
    try {
      setClaimingId(orderId);
      await deliveryService.assignDelivery(orderId, user.id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim delivery job.');
    } finally {
      setClaimingId(null);
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      await deliveryService.updateStatus(deliveryId, status);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const activeDeliveries = myDeliveries.filter((d) => d.deliveryStatus !== 'DELIVERED' && d.deliveryStatus !== 'CANCELLED');
  const completedDeliveries = myDeliveries.filter((d) => d.deliveryStatus === 'DELIVERED');

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      {/* Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: 700 }}>
            Rider Hub
          </span>
          <h1 style={{ color: 'white', fontSize: '2.25rem', marginTop: '0.35rem', marginBottom: '0.4rem' }}>
            Welcome, {user?.name || 'Rider'}! 🚴‍♂️
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Ready to roll? Pick up orders and deliver smiles to foodies across the city.
          </p>
        </div>

        <button onClick={loadData} className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh Jobs</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--warning-light)', color: '#d97706', borderRadius: 'var(--radius-md)' }}>
            <Bike size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Active Tasks</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeDeliveries.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--success-light)', color: '#059669', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Completed</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completedDeliveries.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Available Unassigned</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingDeliveries.length}</span>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.6rem' }}>My Active Deliveries ({activeDeliveries.length})</h2>
          <Link to="/delivery/orders" className="btn btn-outline btn-sm">
            View All Assigned
          </Link>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            <p>You have no active deliveries right now. Claim an open order below!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {activeDeliveries.map((delivery) => {
              const order = delivery.order || {};
              return (
                <div key={delivery.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                        <strong style={{ fontSize: '1.1rem' }}>{order.orderNumber}</strong>
                        <span className="badge badge-warning">{delivery.deliveryStatus}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Restaurant: <strong>{order.restaurant?.name}</strong>
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Payment</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{Number(order.grandTotal).toFixed(2)} ({order.payment?.paymentMethod})
                      </span>
                    </div>
                  </div>

                  {/* Pick & Drop Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', display: 'block' }}>Pickup From:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                        <MapPin size={15} color="var(--primary)" />
                        <span>{order.restaurant?.address}</span>
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', display: 'block' }}>Deliver To:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                        <MapPin size={15} color="var(--success)" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer: {order.customer?.name} ({order.customer?.phone || 'N/A'})</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {delivery.deliveryStatus === 'ASSIGNED' && (
                      <button
                        onClick={() => handleUpdateStatus(delivery.id, 'OUT_FOR_DELIVERY')}
                        className="btn btn-primary btn-sm"
                      >
                        <Bike size={15} />
                        <span>Pick Up & Start Delivery</span>
                      </button>
                    )}

                    {delivery.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleUpdateStatus(delivery.id, 'DELIVERED')}
                        className="btn btn-secondary btn-sm"
                      >
                        <CheckCircle2 size={15} />
                        <span>Mark as Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Jobs to Claim */}
      <div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>
          Open Pickup Requests ({pendingDeliveries.length})
        </h2>

        {pendingDeliveries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.5rem' }} />
            <p>All current orders have assigned riders. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid-2">
            {pendingDeliveries.map((del) => {
              const order = del.order || {};
              return (
                <div key={del.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', display: 'block' }}>{order.orderNumber}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{order.restaurant?.name}</span>
                    </div>
                    <span className="badge badge-info">Open</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>Pickup: {order.restaurant?.address}</div>
                    <div>Drop: {order.deliveryAddress}</div>
                  </div>

                  <button
                    onClick={() => handleClaimDelivery(order.id)}
                    disabled={claimingId === order.id}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', gap: '0.4rem' }}
                  >
                    <Bike size={16} />
                    <span>{claimingId === order.id ? 'Claiming...' : 'Accept Delivery Job'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
