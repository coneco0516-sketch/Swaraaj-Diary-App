import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { DataContext } from '../context/DataContext';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

import { SERVER_URL } from '../config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const { customers } = useContext(DataContext);
  const [identifier, setIdentifier] = useState('');

  const handleProceed = async (e) => {
    e.preventDefault();
    
    // Fetch Staff from API
    let foundStaff = null;
    try {
      const res = await fetch(`${SERVER_URL}/api/staff`);
      const staffMembers = await res.json();
      foundStaff = staffMembers.find(s => s.phone === identifier);
    } catch (err) {
      console.error('API Error:', err);
    }
    
    if (identifier === 'admin') {
      foundStaff = { name: 'Admin', subRole: 'owner', phone: 'admin' };
    }

    if (foundStaff) {
      login({ role: 'vendor', subRole: foundStaff.subRole, phone: foundStaff.phone });
      navigate('/vendor');
      return;
    }

    // Customer check
    if (identifier.length >= 10) {
      const isCustomer = customers.find(c => c.phone === identifier);
      
      if (isCustomer) {
        login({ role: 'customer', phone: identifier, name: isCustomer.name });
        navigate('/customer');
      } else {
        alert('Account not found. Subscribe to Swaraaj or ask your Admin to add you.');
      }
    } else {
      alert('Please enter a valid Phone Number');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div 
          className="card-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 1.5rem' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img 
              src="/logo.png" 
              alt="Swaraaj Logo" 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '24px', 
                margin: '0 auto 1.5rem auto',
                boxShadow: 'var(--shadow-lg)',
                objectFit: 'contain'
              }} 
            />
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>SWARAAJ DAIRY</h1>
            <p className="text-muted" style={{ marginTop: '0.25rem' }}>Secure access for members</p>
          </div>

          <form onSubmit={handleProceed} className="stack" style={{ gap: '1.5rem' }}>
            <div className="input-group">
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Registered Phone Number</label>
              <input 
                type="text" 
                placeholder="Enter your mobile number" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', py: '1.1rem', fontSize: '1rem' }}>
              Access Dashboard
            </button>
            
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '1rem' }}>
              <p>For credentials or access issues, please contact the Dairy Administrator.</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
