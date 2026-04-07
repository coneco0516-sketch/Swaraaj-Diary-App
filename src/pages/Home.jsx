import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Milk, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { user } = React.useContext(UserContext);

  if (user) {
    return <Navigate to={user.role === 'vendor' ? '/vendor' : '/customer'} />;
  }

  return (
    <div className="page-transition" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: '#fff' }}>
      
      {/* Decorative Background Elements */}
      <div className="bubble" style={{ width: '300px', height: '300px', top: '-10%', right: '-5%', opacity: 0.1 }}></div>
      <div className="bubble" style={{ width: '200px', height: '200px', bottom: '5%', left: '-5%', animationDelay: '2s', opacity: 0.1 }}></div>

      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', zIndex: 1 }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
        >
          <div style={{ background: 'var(--primary-light)', width: '90px', height: '90px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 2rem', boxShadow: 'var(--shadow-lg)' }}>
             <Milk size={48} />
          </div>
          
          <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--primary-dark)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            SWARAAJ DAIRY
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
            Your Daily Pure Milk Partner.
          </p>

          <div className="stack" style={{ gap: '1rem', maxWidth: '320px', margin: '0 auto' }}>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', py: '1.2rem', fontSize: '1.1rem', borderRadius: '15px' }}>
              Sign In to Account <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Brand Values */}
        <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
           <div className="card-glass" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.5)' }}>
              <ShieldCheck size={20} color="var(--accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>100% PURE</span>
           </div>
           <div className="card-glass" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.5)' }}>
              <Clock size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>DAILY LOGS</span>
           </div>
        </div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
         &copy; 2026 Swaraaj Milk Dairy. All rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
