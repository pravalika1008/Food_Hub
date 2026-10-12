import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import foodService from '../../services/foodService';
import FoodCard from '../../components/FoodCard';
import { Star, MapPin, Phone, Utensils, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { cartCount, cart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resData, foodData] = await Promise.all([
          restaurantService.getById(id),
          foodService.getByRestaurant(id),
        ]);
        setRestaurant(resData);
        setFoods(foodData);
      } catch (err) {
        console.error('Failed to load restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <p>Loading restaurant menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Restaurant Not Found</h2>
        <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const categories = ['All', ...new Set(foods.map((f) => f.category).filter(Boolean))];
  const displayedFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter((f) => f.category === selectedCategory);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Restaurant Hero Banner */}
      <div 
        style={{
          position: 'relative',
          background: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url(' + (restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80') + ') center/cover no-repeat',
          color: 'white',
          padding: '4rem 0'
        }}
      >
        <div className="container">
          <Link to="/restaurants" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Restaurants
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{restaurant.cuisineType || 'Artisanal'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fbbf24', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Star size={14} fill="#0f172a" />
                  <span>{restaurant.rating?.toFixed(1) || '4.8'}</span>
                </div>
              </div>

              <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.5rem' }}>{restaurant.name}</h1>
              <p style={{ maxWidth: '650px', color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.25rem' }}>
                {restaurant.description || 'Finest gourmet dining, delivering culinary passion straight to your table.'}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--primary)" /> {restaurant.address}
                </div>
                {restaurant.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={16} color="var(--primary)" /> {restaurant.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Cart button */}
            {cartCount > 0 && (
              <Link to="/cart" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
                <ShoppingCart size={20} />
                <span>View Cart ({cartCount}) • ₹{cart.totalAmount?.toFixed(2)}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menu Filter */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          {selectedCategory === 'All' ? 'All Dishes' : selectedCategory} ({displayedFoods.length})
        </h2>

        {displayedFoods.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Utensils size={40} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
            <h3>No Dishes In This Category</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try selecting another category.</p>
          </div>
        ) : (
          <div className="grid-3">
            {displayedFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
