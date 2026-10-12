import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Utensils } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Restaurant Image */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        <img
          src={restaurant.imageUrl || defaultImage}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            color: '#fbbf24',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Star size={14} fill="#fbbf24" />
          <span>{restaurant.rating ? restaurant.rating.toFixed(1) : '4.5'}</span>
        </div>

        {restaurant.cuisineType && (
          <div 
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'var(--primary)',
              color: 'white',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Utensils size={12} />
            <span>{restaurant.cuisineType}</span>
          </div>
        )}
      </div>

      {/* Restaurant Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{restaurant.name}</h3>
        <p 
          style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-muted)', 
            marginBottom: '0.85rem', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            flex: 1 
          }}
        >
          {restaurant.description || 'Delectable dining experience with handcrafted fresh recipes.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontSize: '0.825rem', marginBottom: '1rem' }}>
          <MapPin size={14} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {restaurant.address}
          </span>
        </div>

        <Link to={`/restaurants/${restaurant.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
          View Menu
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
