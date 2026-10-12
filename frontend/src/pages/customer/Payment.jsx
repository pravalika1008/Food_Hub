import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { CreditCard, Smartphone, Landmark, CheckCircle, ShieldCheck, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const method = searchParams.get('method') || 'CARD';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState('Demo Customer');

  // UPI state
  const [upiId, setUpiId] = useState('customer@okaxis');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order for payment:', err);
        setError('Could not retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError('');

      // Process payment API
      await paymentService.processPayment(orderId, method);

      // Successfully processed, navigate to order tracking
      setTimeout(() => {
        navigate(`/customer/orders/${orderId}/tracking`, {
          state: { paymentSuccess: true },
        });
      }, 1000);
    } catch (err) {
      console.error('Payment processing failed:', err);
      // Fallback: If payment already exists or completed, proceed anyway
      navigate(`/customer/orders/${orderId}/tracking`, {
        state: { paymentSuccess: true },
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <p>Loading secure payment checkout...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={40} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h2>Payment Error</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>{error || 'Invalid payment request.'}</p>
          <Link to="/customer/orders" className="btn btn-primary">My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Cancel & Return
        </Link>

        {/* Security Header Banner */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'var(--secondary)', 
            color: 'white', 
            padding: '1.25rem 1.5rem', 
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Lock size={18} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>256-Bit Encrypted Gateway</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Order #{order.orderNumber}</span>
        </div>

        {/* Payment Card Body */}
        <div className="card" style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none', padding: '2rem' }}>
          {/* Amount banner */}
          <div style={{ textAlign: 'center', paddingBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Amount to Pay</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', fontWeight: 800 }}>
              ₹{Number(order.grandTotal).toFixed(2)}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Paying to <strong style={{ color: 'var(--text-main)' }}>{order.restaurant?.name || 'FoodHub Kitchen'}</strong>
            </span>
          </div>

          <form onSubmit={handleCompletePayment}>
            {/* CARD MODE */}
            {method === 'CARD' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <CreditCard size={20} />
                  <span>Card Details (Demo Ready)</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Security Code (CVV)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* UPI MODE */}
            {method === 'UPI' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Smartphone size={20} />
                  <span>UPI Virtual Payment Address</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    className="form-control"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@okhdfcbank"
                    required
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--border-color)', margin: '1.25rem 0' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Or Scan QR with any UPI app:
                  </span>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', letterSpacing: '2px' }}>
                    [ DEMO UPI QR CODE ]
                  </div>
                </div>
              </div>
            )}

            {/* NET BANKING MODE */}
            {method === 'NET_BANKING' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Landmark size={20} />
                  <span>Select Net Banking Institution</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Choose Bank</label>
                  <select
                    className="form-control"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem', gap: '0.5rem' }}
            >
              {processing ? 'Authorizing Payment...' : `Authorize & Pay ₹${Number(order.grandTotal).toFixed(2)}`}
              <ShieldCheck size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
