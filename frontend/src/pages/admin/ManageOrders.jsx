import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { ShoppingBag, ArrowLeft, RefreshCw, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (err) {
      console.error('Failed to load all orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (search.trim()) {
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          (o.customer?.name && o.customer.name.toLowerCase().includes(search.toLowerCase())) ||
          (o.restaurant?.name && o.restaurant.name.toLowerCase().includes(search.toLowerCase())) ||
          (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, search, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = ['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Global Order Ledger</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time audit log of all customer transactions and lifecycle states</p>
        </div>

        <button onClick={fetchOrders} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by order #, customer, restaurant, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No orders matched your current filters.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Grand Total</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th style={{ textAlign: 'right' }}>Override Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>{order.orderNumber}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong>{order.customer?.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                          {order.customer?.email}
                        </span>
                      </div>
                    </td>
                    <td>{order.restaurant?.name}</td>
                    <td>
                      <strong style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>
                        ₹{Number(order.grandTotal).toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <div>
                        <span className="badge badge-secondary">{order.payment?.paymentMethod || 'Online'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                          {order.payment?.paymentStatus || 'COMPLETED'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{order.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="form-control"
                        style={{ width: 'auto', display: 'inline-block', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
