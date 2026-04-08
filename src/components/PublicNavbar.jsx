import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  return (
    <nav className="tab-bar" style={{ position: 'sticky', top: 0, bottom: 'auto', height: '60px', borderRadius: '0 0 20px 20px', borderTop: 'none', borderBottom: '1px solid var(--border)' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary-dark)', fontWeight: '800', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src="/logo.png" alt="logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} /> Swaraaj
      </Link>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem', borderRadius: '10px' }}>Sign In</Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
