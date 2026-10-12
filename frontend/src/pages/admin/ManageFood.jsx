import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import foodService from '../../services/foodService';
import { Utensils, Trash2, Check, X, ArrowLeft, RefreshCw, Search, AlertCircle } from 'lucide-react';

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await foodService.getAll(false);
      setFoods(data || []);
      setFilteredFoods(data || []);
    } catch (err) {
      console.error('Failed to load foods:', err);
      setError('Could not retrieve dish catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    let result = [...foods];

    if (categoryFilter !== 'ALL') {
      result = result.filter((f) => f.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (search.trim()) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          (f.restaurant?.name && f.restaurant.name.toLowerCase().includes(search.toLowerCase())) ||
          (f.description && f.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setFilteredFoods(result);
  }, [categoryFilter, search, foods]);

  const handleToggleAvailability = async (id) => {
    try {
      await foodService.toggleAvailability(id);
      await fetchFoods();
    } catch (err) {
      alert('Failed to update dish availability.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this dish?')) return;
    try {
      await foodService.delete(id);
      await fetchFoods();
    } catch (err) {
      alert('Failed to delete dish.');
    }
  };

  const categories = ['ALL', 'Pizza', 'Pasta', 'Biryani', 'Curry', 'Burgers', 'Sushi', 'Ramen', 'Sides', 'Beverages', 'Desserts'];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Global Menu Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Audit dishes, pricing, kitchen associations, and inventory across all restaurants</p>
        </div>

        <button onClick={fetchFoods} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by dish name, restaurant, or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading dish catalog...</p>
      ) : filteredFoods.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Dishes Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No items matched your current filters.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Restaurant</th>
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
                          <strong style={{ fontSize: '0.95rem', display: 'block' }}>{food.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {food.description || 'Artisanal dish'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{food.restaurant?.name || 'Unassigned'}</span>
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
                      >
                        {food.isAvailable ? <Check size={12} /> : <X size={12} />}
                        <span>{food.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                        title="Delete Food"
                      >
                        <Trash2 size={14} />
                      </button>
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
