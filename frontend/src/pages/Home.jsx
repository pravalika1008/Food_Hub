import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import { Search, Flame, Sparkles, Clock, ShieldCheck, ArrowRight, Utensils } from 'lucide-react';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resList, foodList] = await Promise.all([
          restaurantService.getAll(true),
          foodService.getAll(true)
        ]);
        setRestaurants(resList.slice(0, 8));
        setPopularFoods(foodList.slice(0, 8));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Biryani', icon: '🍛' },
    { name: 'Noodles', icon: '🍜' },
    { name: 'Tacos', icon: '🌮' },
    { name: 'South Indian', icon: '🥞' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Desserts', icon: '🍰' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          padding: '4.5rem 0 5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                color: '#fb923c',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}
            >
              <Sparkles size={16} /> Instant 30-Minute Food Delivery
            </div>

            <h1 style={{ fontSize: '3.25rem', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Craving Delicious Food? <br />
              <span style={{ color: 'var(--primary)' }}>Delivered Hot & Fresh.</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#94a3b8', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Explore handpicked restaurants, top-rated artisanal recipes, and fast contactless doorstep delivery at the click of a button.
            </p>

            {/* Search Bar */}
            <form 
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                padding: '0.4rem 0.6rem 0.4rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
                maxWidth: '620px',
                margin: '0 auto 2.5rem'
              }}
            >
              <Search size={22} color="var(--text-light)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, cuisines, or restaurants..."
                style={{
                  border: 'none',
                  outline: 'none',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  flex: 1,
                  color: 'var(--text-main)'
                }}
              />
              <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
                Search
              </button>
            </form>

            {/* Feature Points */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={18} color="var(--primary)" /> 30 Min Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={18} color="var(--success)" /> 100% Certified Hygiene
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Flame size={18} color="var(--primary)" /> Freshly Prepared
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ padding: '2.5rem 0', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/menu?category=${cat.name}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 1.25rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}
                className="category-pill"
              >
                <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.825rem', letterSpacing: '0.05em' }}>
                Top Rated Spots
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Featured Restaurants</h2>
            </div>
            <Link to="/restaurants" className="btn btn-outline" style={{ gap: '0.4rem' }}>
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading delicious spots...</p>
          ) : (
            <div className="grid-4">
              {restaurants.map((res) => (
                <RestaurantCard key={res.id} restaurant={res} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Foods */}
      <section style={{ padding: '4rem 0', background: '#f1f5f9' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.825rem', letterSpacing: '0.05em' }}>
                Customer Favorites
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Popular Dishes Today</h2>
            </div>
            <Link to="/menu" className="btn btn-outline" style={{ gap: '0.4rem' }}>
              <span>Full Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading menu items...</p>
          ) : (
            <div className="grid-3">
              {popularFoods.map((food) => (
                <FoodCard key={food.id} food={food} showRestaurant={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How FoodHub Works</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            Get your favorite meal in 3 simple and frictionless steps
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: 800 }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Select Restaurant & Dish</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Browse menus, customer ratings, and mouthwatering culinary choices.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: 800 }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Fast & Easy Checkout</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Place your order with instant online payment or cash on delivery.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: 800 }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Doorstep Delivery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Track delivery in real-time as our rider brings hot food right to your door.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
