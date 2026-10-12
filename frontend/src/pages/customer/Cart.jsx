import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, clearCart, cartCount } = useCart();
  const navigate = useNavigate();

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || item.food?.price || 0) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40.0 : 0.0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Looks like you haven't added anything to your cart yet. Explore our top restaurants to find delicious food!
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Explore Menu Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)' }}>You have {cartCount} items in your order bag</p>
        </div>
        <button 
          onClick={clearCart}
          className="btn btn-outline btn-sm"
          style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
        >
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Item List */}
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, marginTop: '1rem', fontSize: '0.95rem' }}>
            <ArrowLeft size={16} /> Add More Items
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
              <span style={{ fontWeight: 600 }}>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Government Taxes (5%)</span>
              <span style={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</span>
            </div>
            
            <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Grand Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--primary-dark)' }}>
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '0.5rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
