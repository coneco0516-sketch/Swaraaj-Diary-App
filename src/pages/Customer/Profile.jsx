import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { DataContext } from '../../context/DataContext';
import { User, Phone, MapPin, Milk, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useContext(UserContext);
  const { customers } = useContext(DataContext);

  const me = customers.find(c => c.phone === user?.phone);

  return (
    <div className="container page-transition">
      <header style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid white', boxShadow: 'var(--shadow)' }}>
          <User size={40} />
        </div>
        <h1 style={{ fontSize: '1.5rem' }}>{me?.name || 'Customer'}</h1>
        <p className="text-muted">{user?.phone}</p>
      </header>

      <div className="stack" style={{ gap: '1rem' }}>
        <div className="card-glass">
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscription Details</h3>
          <div className="stack" style={{ gap: '1.25rem' }}>
            <div className="row-between">
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Milk size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem' }}>Daily Quantity</span>
              </div>
              <span style={{ fontWeight: '700' }}>{me?.defaultQuantity || 0} Liters</span>
            </div>
            <div className="row-between">
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Activity size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem' }}>Milk Rate</span>
              </div>
              <span style={{ fontWeight: '700' }}>₹{me?.rate || 0}/L</span>
            </div>
          </div>
        </div>

        <div className="card-glass">
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Settings</h3>
            <div className="stack">
                <div className="row-between" style={{ padding: '0.5rem 0' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Phone size={18} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.95rem' }}>Update Phone</span>
                    </div>
                    <ChevronRight size={18} color="#cbd5e1" />
                </div>
                <div className="row-between" style={{ padding: '0.5rem 0' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <MapPin size={18} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.95rem' }}>Address</span>
                    </div>
                    <ChevronRight size={18} color="#cbd5e1" />
                </div>
            </div>
        </div>

        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)', marginTop: '1rem' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Swaraaj Milk Dairy App v1.0.4<br/>
        Made with ❤️ for pure dairy
      </p>
    </div>
  );
};

// Activity icon was missing in profile redesign, using generic one
const Activity = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default Profile;
