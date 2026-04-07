import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="page-transition" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div className="container" style={{ marginTop: '1rem' }}>
        <motion.div className="card-glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Terms & Conditions</h1>
          <div className="stack" style={{ gap: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <section>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>1. Usage</h3>
              <p className="text-muted">By using Swaraaj Milk Dairy, you agree to our digital logging system. All data is stored locally for your privacy.</p>
            </section>
            <section>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>2. Deliveries</h3>
              <p className="text-muted">Vendors are responsible for marking daily drops. Customers can view logs in real-time through the History tab.</p>
            </section>
            <section>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>3. Payments</h3>
              <p className="text-muted">Monthly bills are generated on the 1st of every month. Payments should be settled directly with your local vendor.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
