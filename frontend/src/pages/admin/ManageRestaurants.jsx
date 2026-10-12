import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import restaurantService from '../../services/restaurantService';
import api from '../../services/api';
import { Store, Plus, Trash2, Check, X, ArrowLeft, RefreshCw, Star, MapPin, AlertCircle } from 'lucide-react';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New restaurant state
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisineType: 'Italian',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ownerId: 2, // Default to demo restaurant owner
  });

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await restaurantService.getAll(false);
      setRestaurants(data || []);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setError('Could not retrieve restaurants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await restaurantService.toggleStatus(id);
      await fetchRestaurants();
    } catch (err) {
      alert('Failed to update restaurant status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant? This may delete related foods.')) return;
    try {
      await restaurantService.delete(id);
      await fetchRestaurants();
    } catch (err) {
      alert('Failed to delete restaurant.');
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await restaurantService.create(newRestaurant);
      setShowAddForm(false);
      setNewRestaurant({
        name: '',
        description: '',
        address: '',
        phone: '',
        cuisineType: 'Italian',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        ownerId: 2,
      });
      await fetchRestaurants();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create restaurant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Restaurant Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Onboard new partners, audit menus, and manage restaurant statuses</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} />
            <span>{showAddForm ? 'Close Form' : 'Register Restaurant'}</span>
          </button>
          <button onClick={fetchRestaurants} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Add Restaurant Form */}
      {showAddForm && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '2px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Register New Partner Restaurant</h3>
          <form onSubmit={handleCreateRestaurant}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Restaurant Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bella Italia Bistro"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cuisine Type *</label>
                <select
                  className="form-control"
                  value={newRestaurant.cuisineType}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisineType: e.target.value })}
                >
                  <option value="Italian">Italian</option>
                  <option value="Indian">Indian</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+1 555-0192"
                  value={newRestaurant.phone}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={newRestaurant.imageUrl}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address / Location *</label>
              <input
                type="text"
                className="form-control"
                placeholder="12 Little Italy Boulevard, Downtown"
                value={newRestaurant.address}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Authentic artisanal stone-baked pizzas, homemade pastas, and desserts."
                value={newRestaurant.description}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Creating...' : 'Submit & Register'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Restaurants Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading restaurant partners...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Cuisine</th>
                  <th>Rating</th>
                  <th>Address & Phone</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((res) => (
                  <tr key={res.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={res.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'}
                          alt={res.name}
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem', display: 'block' }}>{res.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Owner: {res.owner?.name || 'Assigned'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{res.cuisineType || 'Artisanal'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{res.rating ? res.rating.toFixed(1) : '4.5'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ color: 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {res.address}
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{res.phone || 'No phone'}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(res.id)}
                        className={`badge ${res.isActive ? 'badge-success' : 'badge-danger'}`}
                        style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Click to toggle restaurant status"
                      >
                        {res.isActive ? <Check size={12} /> : <X size={12} />}
                        <span>{res.isActive ? 'Active' : 'Suspended'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to={`/restaurants/${res.id}`} className="btn btn-sm btn-outline" target="_blank" title="View Public Menu">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                          title="Delete Restaurant"
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

export default ManageRestaurants;
