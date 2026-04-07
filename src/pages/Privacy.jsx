import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="page-transition" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div className="container" style={{ marginTop: '1rem' }}>
        <motion.div className="card-glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Privacy Policy</h1>
          <div className="stack" style={{ gap: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <section>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Local Storage</h3>
              <p className="text-muted">Your phone number, name and address are stored securely. We use this data only for logistics and monthly billing.</p>
            </section>
            <section>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Security</h3>
              <p className="text-muted">We do not share your data with third parties. All records are protected within our private server environment.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
