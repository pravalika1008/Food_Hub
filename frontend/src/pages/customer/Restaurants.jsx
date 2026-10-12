import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import RestaurantCard from '../../components/RestaurantCard';
import { Search, Filter, Utensils } from 'lucide-react';

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  const cuisines = ['All', 'Italian', 'Indian', 'Fast Food', 'Japanese', 'Chinese', 'Mexican', 'Healthy', 'South Indian', 'Desserts'];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAll(true);
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let result = [...restaurants];

    if (searchQuery.trim()) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.cuisineType && r.cuisineType.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCuisine !== 'All') {
      result = result.filter(
        (r) => r.cuisineType && r.cuisineType.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    setFilteredRestaurants(result);
  }, [searchQuery, selectedCuisine, restaurants]);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Discover Restaurants</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Explore authentic cuisines and chef-crafted delicacies around you.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem', 
          marginBottom: '2.5rem', 
          background: '#fff', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)' 
        }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '1rem' }}
            placeholder="Search restaurants by name or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
        </div>

        {/* Cuisine Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.5rem' }}>
            <Filter size={15} /> Cuisines:
          </span>
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`btn btn-sm ${selectedCuisine === cuisine ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Fetching amazing spots...
        </p>
      ) : filteredRestaurants.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Utensils size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Restaurants Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            We couldn't find any restaurants matching your search or cuisine filter.
          </p>
        </div>
      ) : (
        <div className="grid-4">
          {filteredRestaurants.map((res) => (
            <RestaurantCard key={res.id} restaurant={res} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
