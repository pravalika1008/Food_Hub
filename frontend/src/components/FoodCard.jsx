import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Check, ShoppingBag } from 'lucide-react';

const FoodCard = ({ food, showRestaurant = false }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = async () => {
    if (!food.isAvailable) return;
    try {
      setLoading(true);
      await addToCart(food, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Food Image */}
      <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden' }}>
        <img
          src={food.imageUrl || defaultImage}
          alt={food.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: food.isAvailable ? 'none' : 'grayscale(80%)'
          }}
          onError={(e) => { e.target.src = defaultImage; }}
        />

        {food.category && (
          <div 
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            {food.category}
          </div>
        )}

        {!food.isAvailable && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Sold Out
          </div>
        )}
      </div>

      {/* Food Details */}
      <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{food.name}</h4>
        
        {showRestaurant && food.restaurant && (
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.35rem' }}>
            {food.restaurant.name}
          </div>
        )}

        <p 
          style={{ 
            fontSize: '0.825rem', 
            color: 'var(--text-muted)', 
            marginBottom: '1rem',
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            flex: 1 
          }}
        >
          {food.description || 'Delicious culinary creation prepared with chef-curated organic ingredients.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{Number(food.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!food.isAvailable || loading}
            className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`}
            style={{ minWidth: '95px' }}
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <Plus size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
