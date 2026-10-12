import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCustomer, isRestaurant, isDelivery, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRestaurant) return '/restaurant/dashboard';
    if (isDelivery) return '/delivery/dashboard';
    return '/customer/dashboard';
  };

  const getRoleIcon = () => {
    if (isAdmin) return <ShieldCheck size={16} />;
    if (isRestaurant) return <Store size={16} />;
    if (isDelivery) return <Bike size={16} />;
    return <User size={16} />;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="brand-logo">
          <div style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            padding: '8px',
            borderRadius: '10px',
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            <UtensilsCrossed size={22} />
          </div>
          <span>Food</span>Hub
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/restaurants" className={`nav-link ${location.pathname === '/restaurants' ? 'active' : ''}`}>
              Restaurants
            </Link>
          </li>
          <li>
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>
              Menu
            </Link>
          </li>

          {/* Customer Specific Links */}
          {isAuthenticated && (isCustomer || (!isRestaurant && !isDelivery && !isAdmin)) && (
            <li>
              <Link to="/customer/orders" className={`nav-link ${location.pathname === '/customer/orders' ? 'active' : ''}`}>
                <ShoppingBag size={16} /> My Orders
              </Link>
            </li>
          )}
        </ul>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cart Icon (For Customers & Guests) */}
          {(!isAuthenticated || isCustomer) && (
            <Link 
              to="/cart" 
              className="btn btn-outline"
              style={{ position: 'relative', padding: '0.55rem 0.9rem' }}
              title="View Cart"
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Auth Buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to={getDashboardLink()} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>

              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  background: '#f1f5f9',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                {getRoleIcon()}
                <span style={{ fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  {user?.role}
                </span>
              </div>

              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
