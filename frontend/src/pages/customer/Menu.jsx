import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodCard from '../../components/FoodCard';
import { Search, Filter, Utensils } from 'lucide-react';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Pizza', 'Pasta', 'Biryani', 'Curry', 'Burgers', 'Sushi', 'Ramen', 'Noodles', 'Rice', 'Tacos', 'Bowls', 'Salads', 'Healthy', 'South Indian', 'Sides', 'Beverages', 'Desserts'];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await foodService.getAll(true);
        setFoods(data);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    let result = [...foods];

    if (searchQuery.trim()) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(
        (f) => f.category && f.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredFoods(result);
  }, [searchQuery, selectedCategory, foods]);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Explore Our Menu</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Discover chef-prepared dishes across all top partner kitchens in town.
        </p>
      </div>

      {/* Search and Category Filter */}
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
            placeholder="Search dishes by name, ingredients, or taste..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.5rem' }}>
            <Filter size={15} /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Preparing menu items...
        </p>
      ) : filteredFoods.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Utensils size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Dishes Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try tweaking your search term or select another category filter.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} showRestaurant={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
