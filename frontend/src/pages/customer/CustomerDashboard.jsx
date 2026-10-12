import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import foodService from '../../services/foodService';
import OrderCard from '../../components/OrderCard';
import FoodCard from '../../components/FoodCard';
import { ShoppingBag, Utensils, Clock, ShoppingCart, ArrowRight } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersData, foodsData] = await Promise.all([
          orderService.getMyOrders(),
          foodService.getAll(true)
        ]);
        setOrders(ordersData);
        setRecommendedFoods(foodsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  );

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          boxShadow: '0 10px 20px rgba(234, 88, 12, 0.2)'
        }}
      >
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
          Customer Dashboard
        </span>
        <h1 style={{ color: 'white', fontSize: '2.25rem', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
          Hello, {user?.name || 'Foodie'}! 👋
        </h1>
        <p style={{ opacity: 0.95, maxWidth: '600px', fontSize: '1rem' }}>
          Ready for your next feast? Check your recent orders or discover exciting new dishes around you.
        </p>
      </div>

      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Active Orders</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeOrders.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#dbeafe', color: '#2563eb', borderRadius: 'var(--radius-md)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Orders</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{orders.length}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: '#fef3c7', color: '#d97706', borderRadius: 'var(--radius-md)' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Cart Items</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{cartCount}</span>
          </div>
        </div>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Active Deliveries ({activeOrders.length})</h2>
            <Link to="/customer/orders" className="btn btn-outline btn-sm">
              All Orders
            </Link>
          </div>
          <div>
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended For You */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Recommended Dishes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fresh picks prepared right now</p>
          </div>
          <Link to="/menu" className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <span>Full Menu</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid-3">
          {recommendedFoods.map((food) => (
            <FoodCard key={food.id} food={food} showRestaurant={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
