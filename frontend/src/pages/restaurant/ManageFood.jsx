import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import foodService from '../../services/foodService';
import { Plus, Edit2, Trash2, Check, X, Search, ArrowLeft, AlertCircle } from 'lucide-react';

const ManageFood = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

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
        const foodData = await foodService.getByRestaurant(currentRes.id);
        setFoods(foodData);
        setFilteredFoods(foodData);
      }
    } catch (err) {
      console.error('Failed to load menu dishes:', err);
      setError('Could not load dishes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredFoods(foods);
    } else {
      setFilteredFoods(
        foods.filter(
          (f) =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, foods]);

  const handleToggleAvailability = async (foodId) => {
    try {
      await foodService.toggleAvailability(foodId);
      await loadData();
    } catch (err) {
      alert('Failed to update dish availability.');
    }
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this menu dish?')) return;
    try {
      await foodService.delete(foodId);
      await loadData();
    } catch (err) {
      alert('Failed to delete dish.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/restaurant/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Manage Menu Dishes</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {restaurant ? `${restaurant.name} • ${foods.length} items on catalog` : 'Manage your restaurant items'}
          </p>
        </div>

        <Link to="/restaurant/food/add" className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Plus size={18} />
          <span>Add New Dish</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search menu by dish name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading menu dishes...</p>
      ) : filteredFoods.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Dishes Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Start by adding tasty recipes to your restaurant menu!</p>
          <Link to="/restaurant/food/add" className="btn btn-primary">Add Dish</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                          alt={food.name}
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.95rem' }}>{food.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {food.description || 'Artisanal recipe'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{food.category || 'General'}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1rem' }}>₹{Number(food.price).toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(food.id)}
                        className={`badge ${food.isAvailable ? 'badge-success' : 'badge-danger'}`}
                        style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Click to toggle availability"
                      >
                        {food.isAvailable ? <Check size={12} /> : <X size={12} />}
                        <span>{food.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link
                          to={`/restaurant/food/edit/${food.id}`}
                          className="btn btn-sm btn-outline"
                          title="Edit Dish"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                          title="Delete Dish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFood;
