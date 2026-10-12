import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import OrderCard from '../../components/OrderCard';
import { ShoppingBag, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Could not retrieve your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ACTIVE') {
      return ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status);
    }
    if (filter === 'COMPLETED') {
      return order.status === 'DELIVERED';
    }
    if (filter === 'CANCELLED') {
      return order.status === 'CANCELLED';
    }
    return true;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track past meals, delivery statuses, and re-order favorites</p>
        </div>

        <button onClick={fetchOrders} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { key: 'ALL', label: `All Orders (${orders.length})` },
          { key: 'ACTIVE', label: `Active (${orders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length})` },
          { key: 'COMPLETED', label: `Completed (${orders.filter((o) => o.status === 'DELIVERED').length})` },
          { key: 'CANCELLED', label: `Cancelled (${orders.filter((o) => o.status === 'CANCELLED').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p>Loading your order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '480px', margin: '0 auto' }}>
          <ShoppingBag size={48} color="var(--text-light)" style={{ margin: '0 auto 1.25rem' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
            {filter === 'ALL'
              ? "You haven't placed any orders yet. Discover delicious dishes in our menu!"
              : `You have no ${filter.toLowerCase()} orders.`}
          </p>
          <Link to="/menu" className="btn btn-primary">
            Explore Menu Now
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
