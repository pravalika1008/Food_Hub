import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'var(--primary)',
                padding: '7px',
                borderRadius: '8px',
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}>
                <UtensilsCrossed size={20} />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.35rem', margin: 0 }}>Food<span style={{ color: 'var(--primary)' }}>Hub</span></h3>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8' }}>
              Your ultimate online food destination. Fast delivery, freshest ingredients, and dishes from your favorite local culinary masters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/restaurants">All Restaurants</Link></li>
              <li><Link to="/menu">Explore Menu</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4>Role Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/customer/dashboard">Customer Dashboard</Link></li>
              <li><Link to="/restaurant/dashboard">Restaurant Partner</Link></li>
              <li><Link to="/delivery/dashboard">Delivery Partner</Link></li>
              <li><Link to="/admin/dashboard">System Administrator</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Get In Touch</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" /> 100 Innovation Blvd, Tech Hub
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary)" /> +1 (800) 555-FOOD
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" /> support@foodhub.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodHub. Built with Full Stack Java Spring Boot & React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
