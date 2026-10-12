import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CheckCircle2, AlertCircle, Truck, Package, ChevronRight } from 'lucide-react';

const OrderCard = ({ order, onCancel }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="badge badge-info"><Clock size={12} /> Placed</span>;
      case 'CONFIRMED':
        return <span className="badge badge-primary"><CheckCircle2 size={12} /> Confirmed</span>;
      case 'PREPARING':
        return <span className="badge badge-warning"><Package size={12} /> Preparing</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="badge badge-warning"><Truck size={12} /> Out For Delivery</span>;
      case 'DELIVERED':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Delivered</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger"><AlertCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recent';

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      {/* Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{order.orderNumber}</span>
            {getStatusBadge(order.status)}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Total Paid</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
            ₹{Number(order.grandTotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Restaurant & Delivery Address */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
        <div>
          <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Restaurant</span>
          <span style={{ fontWeight: 700 }}>{order.restaurant?.name || 'Partner Restaurant'}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Delivery Address</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <MapPin size={14} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {order.deliveryAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Items Summary */}
      <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
          Items Ordered ({order.items?.length || 0})
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(order.items || []).map((item, idx) => (
            <span 
              key={idx} 
              style={{ 
                background: '#fff', 
                border: '1px solid var(--border-color)', 
                padding: '0.25rem 0.65rem', 
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: 600
              }}
            >
              {item.quantity}x {item.foodName || item.food?.name}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Payment: <strong style={{ color: 'var(--text-main)' }}>{order.payment?.paymentMethod || 'Online'}</strong> ({order.payment?.paymentStatus || 'COMPLETED'})
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {order.status === 'PLACED' && onCancel && (
            <button 
              onClick={() => onCancel(order.id)} 
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)', borderColor: '#fee2e2' }}
            >
              Cancel Order
            </button>
          )}

          <Link to={`/customer/orders/${order.id}/tracking`} className="btn btn-primary btn-sm">
            <span>Track Order</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
