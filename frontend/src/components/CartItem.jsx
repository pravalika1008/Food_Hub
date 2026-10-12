import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const food = item.food || {};
  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const itemTotal = (item.price || food.price || 0) * item.quantity;

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        background: '#fff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.75rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      {/* Food Thumb & Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px', flex: 1 }}>
        <img
          src={food.imageUrl || defaultImage}
          alt={food.name}
          style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div>
          <h4 style={{ fontSize: '0.975rem', marginBottom: '0.2rem' }}>{food.name || 'Food Item'}</h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ₹{Number(item.price || food.price || 0).toFixed(2)} each
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#f1f5f9',
          padding: '0.25rem 0.5rem',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <button 
          onClick={handleDecrement}
          className="btn btn-sm"
          style={{ padding: '0.25rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}
        >
          <Minus size={14} />
        </button>
        <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          {item.quantity}
        </span>
        <button 
          onClick={handleIncrement}
          className="btn btn-sm"
          style={{ padding: '0.25rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal & Delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', minWidth: '80px', textAlign: 'right' }}>
          ₹{itemTotal.toFixed(2)}
        </span>
        <button
          onClick={() => removeFromCart(item.id)}
          className="btn btn-sm btn-outline"
          style={{ color: 'var(--danger)', borderColor: '#fee2e2', padding: '0.4rem' }}
          title="Remove from cart"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
