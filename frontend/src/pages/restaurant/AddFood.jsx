import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import foodService from '../../services/foodService';
import { Utensils, ArrowLeft, Image, DollarSign, Check, AlertCircle } from 'lucide-react';

const AddFood = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    category: 'Pizza',
    restaurantId: '',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Pizza', 'Burgers', 'Biryani', 'Curry', 'Pasta', 'Sushi', 'Ramen', 'Sides', 'Beverages', 'Desserts'];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        let userRestaurants = [];
        if (user?.id) {
          try {
            userRestaurants = await restaurantService.getByOwner(user.id);
          } catch (e) {}
        }

        if (!userRestaurants || userRestaurants.length === 0) {
          userRestaurants = await restaurantService.getAll(false);
        }

        setRestaurants(userRestaurants);
        if (userRestaurants.length > 0) {
          setFormData((prev) => ({ ...prev, restaurantId: userRestaurants[0].id }));
        }
      } catch (err) {
        console.error('Failed to load restaurant for food creation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await foodService.create({
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: Number(formData.restaurantId),
      });

      navigate('/restaurant/food');
    } catch (err) {
      console.error('Failed to add food:', err);
      setError(err.response?.data?.message || 'Error creating dish. Please verify input.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link to="/restaurant/food" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dishes
        </Link>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ padding: '8px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
              <Utensils size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem' }}>Add New Dish</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Publish recipe to your live digital menu</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Restaurant Selector */}
            <div className="form-group">
              <label className="form-label">Select Kitchen / Restaurant</label>
              <select
                name="restaurantId"
                className="form-control"
                value={formData.restaurantId}
                onChange={handleChange}
                required
              >
                {restaurants.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dish Name */}
            <div className="form-group">
              <label className="form-label">Dish Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Truffle Mushroom Wood-Fired Pizza"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category and Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className="form-control"
                  placeholder="349.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="form-control"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description & Ingredients</label>
              <textarea
                name="description"
                rows="3"
                className="form-control"
                placeholder="Crispy crust topped with wild sautéed mushrooms, creamy fontina cheese, and fresh thyme."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Availability Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="isAvailable" style={{ fontWeight: 600, fontSize: '0.925rem', cursor: 'pointer' }}>
                Item is currently in stock & available for orders
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              <Check size={18} />
              <span>{submitting ? 'Saving Dish...' : 'Create & Publish Dish'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
