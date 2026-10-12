import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import foodService from '../../services/foodService';
import { Edit3, ArrowLeft, Check, AlertCircle } from 'lucide-react';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Pizza', 'Burgers', 'Biryani', 'Curry', 'Pasta', 'Sushi', 'Ramen', 'Sides', 'Beverages', 'Desserts'];

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        const data = await foodService.getById(id);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price ? String(data.price) : '',
          imageUrl: data.imageUrl || '',
          category: data.category || 'Pizza',
          isAvailable: data.isAvailable ?? true,
        });
      } catch (err) {
        console.error('Failed to load dish:', err);
        setError('Dish not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      await foodService.update(id, {
        ...formData,
        price: parseFloat(formData.price),
      });

      navigate('/restaurant/food');
    } catch (err) {
      console.error('Failed to update dish:', err);
      setError(err.response?.data?.message || 'Error updating dish.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <p>Loading dish details...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link to="/restaurant/food" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dishes
        </Link>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ padding: '8px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
              <Edit3 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem' }}>Edit Dish Details</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update pricing, availability, or photos</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Dish Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="form-control"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description & Ingredients</label>
              <textarea
                name="description"
                rows="3"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

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
                Item is available for orders
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              <Check size={18} />
              <span>{submitting ? 'Saving Changes...' : 'Update Dish'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFood;
