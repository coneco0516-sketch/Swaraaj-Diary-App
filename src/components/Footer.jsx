import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      padding: '2rem 1rem',
      marginTop: 'auto',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
        <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Terms & Conditions</Link>
        <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</Link>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} Swaraaj Milk Dairy. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
