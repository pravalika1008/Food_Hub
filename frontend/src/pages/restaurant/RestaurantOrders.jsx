import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import orderService from '../../services/orderService';
import { ShoppingBag, ArrowLeft, RefreshCw, ChefHat, CheckCircle2, Clock, AlertCircle, MapPin } from 'lucide-react';

const RestaurantOrders = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let userRestaurants = [];
      if (user?.id) {
        try {
          userRestaurants = await restaurantService.getByOwner(user.id);
        } catch (e) {}
      }

      let currentRes = null;
      if (userRestaurants && userRestaurants.length > 0) {
        currentRes = userRestaurants[0];
      } else {
        const allRes = await restaurantService.getAll(false);
        currentRes = allRes[0] || null;
      }

      setRestaurant(currentRes);

      if (currentRes?.id) {
        const data = await orderService.getByRestaurant(currentRes.id);
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load restaurant orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ACTIVE') return ['PLACED', 'CONFIRMED', 'PREPARING'].includes(order.status);
    if (filter === 'COMPLETED') return order.status === 'DELIVERED';
    if (filter === 'CANCELLED') return order.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/restaurant/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Kitchen Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {restaurant ? `${restaurant.name} • Live order pipeline` : 'Manage incoming orders'}
          </p>
        </div>

        <button onClick={fetchOrders} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { key: 'ALL', label: `All Orders (${orders.length})` },
          { key: 'ACTIVE', label: `Active (${orders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING'].includes(o.status)).length})` },
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

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading kitchen tickets...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '480px', margin: '0 auto' }}>
          <ShoppingBag size={48} color="var(--text-light)" style={{ margin: '0 auto 1.25rem' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>There are currently no orders in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredOrders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{order.orderNumber}</strong>
                    <span className="badge badge-primary">{order.status}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Customer: {order.customer?.name} ({order.customer?.phone || 'No phone'})
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Order Value</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    ₹{Number(order.grandTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Address & Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Delivery Address</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <div>
                    <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Special Instructions</span>
                    <span style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>"{order.specialInstructions}"</span>
                  </div>
                )}
              </div>

              {/* Ordered Items */}
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Kitchen Prep Checklist:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {(order.items || []).map((item, idx) => (
                    <span key={idx} style={{ background: 'white', padding: '0.3rem 0.65rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.quantity}x {item.foodName || item.food?.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', flexWrap: 'wrap' }}>
                {order.status === 'PLACED' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                    disabled={updatingId === order.id}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 size={15} />
                    <span>Confirm Order</span>
                  </button>
                )}

                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                    disabled={updatingId === order.id}
                    className="btn btn-primary btn-sm"
                  >
                    <ChefHat size={15} />
                    <span>Start Cooking</span>
                  </button>
                )}

                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                    disabled={updatingId === order.id}
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Hand Over to Rider</span>
                  </button>
                )}

                {['PLACED', 'CONFIRMED'].includes(order.status) && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                    disabled={updatingId === order.id}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                  >
                    Reject Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
