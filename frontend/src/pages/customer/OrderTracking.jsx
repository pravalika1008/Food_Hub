import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import deliveryService from '../../services/deliveryService';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  Home, 
  AlertCircle, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  RefreshCw,
  Receipt
} from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTracking = async () => {
    try {
      setLoading(true);
      setError('');
      const orderData = await orderService.getById(id);
      setOrder(orderData);

      try {
        const delData = await deliveryService.getByOrderId(id);
        setDelivery(delData);
      } catch (delErr) {
        // Delivery record might be null or part of order
        setDelivery(orderData.delivery || null);
      }
    } catch (err) {
      console.error('Failed to load tracking data:', err);
      setError('Could not retrieve tracking information for this order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !order) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <p>Connecting to FoodHub Live Tracker...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={40} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>{error || 'Unable to locate order.'}</p>
          <Link to="/customer/orders" className="btn btn-primary">Back to Orders</Link>
        </div>
      </div>
    );
  }

  // Steps definition
  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received by kitchen', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Kitchen accepted order', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'Preparing Food', desc: 'Chef is cooking your meal', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', label: 'On the Way', desc: 'Rider is heading to your door', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your meal!', icon: Home },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const isCancelled = order.status === 'CANCELLED';
  const currentStep = getStepIndex(order.status);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <ArrowLeft size={16} /> All Orders
          </Link>

          <button onClick={fetchTracking} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <RefreshCw size={14} />
            <span>Live Update</span>
          </button>
        </div>

        {/* Live Tracking Header */}
        <div 
          style={{
            background: isCancelled ? 'var(--danger)' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            padding: '2.25rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8' }}>
                Live Delivery Status
              </span>
              <h1 style={{ color: 'white', fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                {isCancelled ? 'Order Cancelled' : order.status.replace(/_/g, ' ')}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                Order #{order.orderNumber} • Placed from {order.restaurant?.name || 'Restaurant Partner'}
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block' }}>Estimated Arrival</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                {order.status === 'DELIVERED' ? 'Delivered' : isCancelled ? 'N/A' : '20 - 30 Mins'}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Tracking Visualizer */}
        {!isCancelled && (
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: '0.5rem', position: 'relative' }}>
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div 
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: isPassed ? 'var(--primary)' : '#e2e8f0',
                        color: isPassed ? 'white' : 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem',
                        boxShadow: isCurrent ? '0 0 0 4px var(--primary-light)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <span style={{ fontSize: '0.825rem', fontWeight: isCurrent ? 800 : 600, color: isPassed ? 'var(--text-main)' : 'var(--text-light)', marginBottom: '0.2rem' }}>
                      {step.label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'none' }}>
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery Agent Card */}
        {delivery && delivery.deliveryPerson && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bike size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Assigned Delivery Partner
                </span>
                <h4 style={{ fontSize: '1.1rem' }}>{delivery.deliveryPerson.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Phone size={13} />
                  <span>{delivery.deliveryPerson.phone || '+1 555-0199'}</span>
                </div>
              </div>
            </div>

            <a href={`tel:${delivery.deliveryPerson.phone || ''}`} className="btn btn-outline btn-sm">
              Call Rider
            </a>
          </div>
        )}

        {/* Order Details & Summary Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Receipt size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.3rem' }}>Order & Payment Summary</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Delivery Location</span>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{order.deliveryAddress}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>Payment Status</span>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>{order.payment?.paymentMethod || 'Online'}</strong> — <span className="badge badge-success">{order.payment?.paymentStatus || 'COMPLETED'}</span>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Items Ordered:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(order.items || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.foodName || item.food?.name}</span>
                  <span style={{ fontWeight: 600 }}>₹{Number(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Items Total</span>
              <span>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery Fee</span>
              <span>₹{Number(order.deliveryFee || 40).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Government Tax (5%)</span>
              <span>₹{Number(order.tax || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed var(--border-color)', paddingTop: '0.75rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--primary-dark)' }}>₹{Number(order.grandTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
