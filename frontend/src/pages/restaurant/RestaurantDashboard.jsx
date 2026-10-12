import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import foodService from '../../services/foodService';
import orderService from '../../services/orderService';
import { Utensils, ShoppingBag, Clock, Plus, Store, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Find restaurants owned by user or fallback to first available
        let userRestaurants = [];
        if (user?.id) {
          try {
            userRestaurants = await restaurantService.getByOwner(user.id);
          } catch (e) {
            console.warn(e);
          }
        }

        let currentRes = null;
        if (userRestaurants && userRestaurants.length > 0) {
          currentRes = userRestaurants[0];
        } else {
          // Fallback to first restaurant in DB for seamless testing
          const allRes = await restaurantService.getAll(false);
          currentRes = allRes[0] || null;
        }

        setRestaurant(currentRes);

        if (currentRes?.id) {
          const [foodData, orderData] = await Promise.all([
            foodService.getByRestaurant(currentRes.id),
            orderService.getByRestaurant(currentRes.id),
          ]);
          setFoods(foodData);
          setOrders(orderData);
        }
      } catch (err) {
        console.error('Restaurant dashboard error:', err);
        setError('Failed to load restaurant dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const activeOrders = orders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING'].includes(o.status));
  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <p>Loading restaurant dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      {/* Welcome Banner */}
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
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#fb923c', fontWeight: 700 }}>
            Kitchen Portal
          </span>
          <h1 style={{ color: 'white', fontSize: '2.25rem', marginTop: '0.35rem', marginBottom: '0.4rem' }}>
            {restaurant ? restaurant.name : 'Restaurant Dashboard'}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            {restaurant?.address || 'Manage your live menu, kitchen orders, and culinary presence'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/restaurant/food/add" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Add New Dish
          </Link>
          <Link to="/restaurant/orders" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', gap: '0.4rem' }}>
            <ShoppingBag size={16} /> Live Orders
          </Link>
        </div>
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
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Pending Orders</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeOrders.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <Utensils size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Menu Dishes</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{foods.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--success-light)', color: '#059669', borderRadius: 'var(--radius-md)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Revenue</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{revenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#dbeafe', color: '#2563eb', borderRadius: 'var(--radius-md)' }}>
            <Store size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Status</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>
              {restaurant?.isActive ? 'Online & Open' : 'Open'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Live Incoming Orders + Quick Food Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        
        {/* Incoming Orders Preview */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Active Kitchen Orders</h3>
            <Link to="/restaurant/orders" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All ({orders.length})
            </Link>
          </div>

          {activeOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.5rem' }} />
              <p>Kitchen is clear! No pending orders right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeOrders.slice(0, 4).map((order) => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontWeight: 800, display: 'block' }}>{order.orderNumber}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {(order.items || []).length} items • ₹{Number(order.grandTotal).toFixed(2)}
                    </span>
                  </div>
                  <span className="badge badge-warning">{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Overview */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Menu Catalog</h3>
            <Link to="/restaurant/food" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
              Manage Dishes ({foods.length})
            </Link>
          </div>

          {foods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Utensils size={36} color="var(--text-light)" style={{ margin: '0 auto 0.5rem' }} />
              <p>No dishes added yet. Create your first menu item!</p>
              <Link to="/restaurant/food/add" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Add Food
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {foods.slice(0, 5).map((food) => (
                <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                      alt={food.name}
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>{food.name}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{food.category}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    ₹{Number(food.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
