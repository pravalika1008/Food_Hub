import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import restaurantService from '../../services/restaurantService';
import foodService from '../../services/foodService';
import orderService from '../../services/orderService';
import deliveryService from '../../services/deliveryService';
import { 
  Users, 
  Store, 
  Utensils, 
  ShoppingBag, 
  Bike, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    restaurantsCount: 0,
    foodsCount: 0,
    ordersCount: 0,
    deliveriesCount: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const [usersRes, resRes, foodRes, ordersRes, delRes] = await Promise.all([
          api.get('/users').catch(() => ({ data: [] })),
          restaurantService.getAll(false).catch(() => []),
          foodService.getAll(false).catch(() => []),
          orderService.getAllOrders().catch(() => []),
          deliveryService.getAll().catch(() => []),
        ]);

        const orders = ordersRes || [];
        const revenue = orders
          .filter((o) => o.status !== 'CANCELLED')
          .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

        setStats({
          usersCount: usersRes.data?.length || 0,
          restaurantsCount: resRes.length || 0,
          foodsCount: foodRes.length || 0,
          ordersCount: orders.length || 0,
          deliveriesCount: delRes.length || 0,
          totalRevenue: revenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      {/* Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#fb923c', fontWeight: 700 }}>
          Master Administration
        </span>
        <h1 style={{ color: 'white', fontSize: '2.25rem', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
          FoodHub Control Center
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
          Complete global administration over users, partner kitchens, menus, live deliveries, and platform revenue.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#dbeafe', color: '#2563eb', borderRadius: 'var(--radius-md)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Users</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.usersCount}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <Store size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Restaurants</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.restaurantsCount}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#fef3c7', color: '#d97706', borderRadius: 'var(--radius-md)' }}>
            <Utensils size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Dishes</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.foodsCount}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--success-light)', color: '#059669', borderRadius: 'var(--radius-md)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Platform Gross</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800 }}>₹{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#ede9fe', color: '#7c3aed', borderRadius: 'var(--radius-md)' }}>
            <Bike size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Deliveries</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.deliveriesCount}</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Management Portals</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <Link to="/admin/users" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Manage Users</span>
            <ArrowRight size={16} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            View accounts, roles (Customer, Restaurant, Delivery, Admin) and delete/edit permissions.
          </p>
        </Link>

        <Link to="/admin/restaurants" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Manage Restaurants</span>
            <ArrowRight size={16} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Approve partner restaurants, toggle active status, manage addresses and culinary styles.
          </p>
        </Link>

        <Link to="/admin/food" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Manage Food</span>
            <ArrowRight size={16} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Review global dishes, prices, categories, and inventory availability across kitchens.
          </p>
        </Link>

        <Link to="/admin/orders" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Manage Orders</span>
            <ArrowRight size={16} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Inspect all customer orders, track payments, override order states and troubleshoot.
          </p>
        </Link>

        <Link to="/admin/delivery" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Manage Delivery</span>
            <ArrowRight size={16} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Assign riders to pending orders, track transit progress, and view completed dispatches.
          </p>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Latest System Orders</h2>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            View All ({stats.ordersCount})
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            <p>No orders logged in the database yet.</p>
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
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.orderNumber}</strong>
                      </td>
                      <td>{order.customer?.name}</td>
                      <td>{order.restaurant?.name}</td>
                      <td>₹{Number(order.grandTotal).toFixed(2)}</td>
                      <td>
                        <span className="badge badge-secondary">{order.payment?.paymentMethod || 'Online'}</span>
                      </td>
                      <td>
                        <span className="badge badge-primary">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
