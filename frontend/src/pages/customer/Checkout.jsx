import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { MapPin, CreditCard, DollarSign, Smartphone, Landmark, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart, cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || item.food?.price || 0) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40.0 : 0.0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2>No Items to Checkout</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Your cart is empty. Please add items to your cart first.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Please provide a valid delivery address.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Find restaurant ID from cart items
      const restaurantId = items[0]?.food?.restaurant?.id || 1;

      const orderPayload = {
        restaurantId,
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod,
        specialInstructions: specialInstructions.trim(),
        items: items.map((i) => ({
          foodId: i.food?.id,
          quantity: i.quantity,
        })),
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      await clearCart();

      if (paymentMethod === 'COD') {
        navigate(`/customer/orders/${createdOrder.id}/tracking`, {
          state: { message: 'Order placed successfully with Cash on Delivery!' },
        });
      } else {
        navigate(`/payment?orderId=${createdOrder.id}&method=${paymentMethod}`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Order Checkout</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
        Confirm delivery details and choose your preferred payment option.
      </p>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column: Delivery & Payment Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Delivery Address Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <MapPin size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem' }}>Delivery Address</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Full Street Address & Landmarks</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Lotus Towers, Main Road, Bangalore"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Special Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Leave package by the door, ring doorbell"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Select Payment Method</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'CARD' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <CreditCard size={18} color="var(--primary)" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Credit / Debit Card</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay</span>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'UPI' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <Smartphone size={18} color="var(--primary)" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>UPI Instant</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm</span>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'NET_BANKING' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'NET_BANKING' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="NET_BANKING"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <Landmark size={18} color="var(--primary)" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Net Banking</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All Major Banks</span>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'COD' ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <DollarSign size={18} color="var(--primary)" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Cash on Delivery</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay at doorstep</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Order Review ({cartCount} items)
            </h3>

            {/* List preview */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.quantity}x {item.food?.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>₹{((item.price || item.food?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Charge</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Taxes & Fees</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed var(--border-color)', paddingTop: '0.75rem', fontSize: '1.25rem', fontWeight: 800 }}>
                <span>Total to Pay</span>
                <span style={{ color: 'var(--primary-dark)' }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              {submitting ? 'Placing Order...' : (paymentMethod === 'COD' ? 'Confirm Order (Cash)' : 'Proceed to Payment')}
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
