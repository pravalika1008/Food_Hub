import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';
import api from '../../services/api';
import { Bike, ArrowLeft, RefreshCw, MapPin, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ManageDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryRiders, setDeliveryRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [delList, riderList] = await Promise.all([
        deliveryService.getAll().catch(() => []),
        api.get('/users/role/DELIVERY').catch(() => ({ data: [] })),
      ]);
      setDeliveries(delList || []);
      setDeliveryRiders(riderList.data || []);
    } catch (err) {
      console.error('Failed to load delivery management data:', err);
      setError('Could not retrieve deliveries or rider personnel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      setAssigningId(orderId);
      await deliveryService.assignDelivery(orderId, Number(riderId));
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign rider to delivery.');
    } finally {
      setAssigningId(null);
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      await deliveryService.updateStatus(deliveryId, status);
      await fetchData();
    } catch (err) {
      alert('Failed to update delivery state.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Fleet & Delivery Logistics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Dispatch riders, assign live routes, and monitor real-time delivery handoffs</p>
        </div>

        <button onClick={fetchData} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh Fleet</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Available fleet metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <Bike size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Registered Riders</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{deliveryRiders.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--warning-light)', color: '#d97706', borderRadius: 'var(--radius-md)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Pending / In Transit</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {deliveries.filter((d) => d.deliveryStatus !== 'DELIVERED' && d.deliveryStatus !== 'CANCELLED').length}
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--success-light)', color: '#059669', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Delivered Successfully</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {deliveries.filter((d) => d.deliveryStatus === 'DELIVERED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading fleet ledger...</p>
      ) : deliveries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Deliveries Recorded</h3>
          <p style={{ color: 'var(--text-muted)' }}>Deliveries will appear once orders are placed.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Pickup (Kitchen)</th>
                  <th>Destination (Customer)</th>
                  <th>Assigned Rider</th>
                  <th>Delivery Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((del) => {
                  const order = del.order || {};
                  return (
                    <tr key={del.id}>
                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>{order.orderNumber}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          ₹{Number(order.grandTotal).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{order.restaurant?.name}</strong>
                          <span style={{ color: 'var(--text-muted)', display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.restaurant?.address}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{order.customer?.name}</strong>
                          <span style={{ color: 'var(--text-muted)', display: 'block', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.deliveryAddress}
                          </span>
                        </div>
                      </td>
                      <td>
                        {del.deliveryPerson ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            <Bike size={15} color="var(--primary)" />
                            <span>{del.deliveryPerson.name}</span>
                          </div>
                        ) : (
                          <select
                            className="form-control"
                            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                            defaultValue=""
                            disabled={assigningId === order.id}
                            onChange={(e) => handleAssignRider(order.id, e.target.value)}
                          >
                            <option value="" disabled>
                              Assign Rider...
                            </option>
                            {deliveryRiders.map((rider) => (
                              <option key={rider.id} value={rider.id}>
                                {rider.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${del.deliveryStatus === 'DELIVERED' ? 'badge-success' : del.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'badge-warning' : 'badge-secondary'}`}>
                          {del.deliveryStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <select
                          className="form-control"
                          style={{ width: 'auto', display: 'inline-block', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                          value={del.deliveryStatus}
                          onChange={(e) => handleUpdateStatus(del.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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

export default ManageDelivery;
