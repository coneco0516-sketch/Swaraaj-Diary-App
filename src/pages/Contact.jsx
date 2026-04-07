import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="page-transition" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div className="container" style={{ marginTop: '1rem' }}>
        <motion.div className="card-glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Get in Touch</h1>
          
          <div className="stack" style={{ gap: '1rem' }}>
            <div className="card-glass" style={{ background: 'var(--bg-soft)', border: 'none', padding: '1rem' }}>
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: 'white', p: '0.5rem', borderRadius: '8px' }}><Phone size={20} color="var(--primary)" /></div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Call Us</p>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>+91 98765 43210</p>
                  </div>
               </div>
            </div>

            <div className="card-glass" style={{ background: 'var(--bg-soft)', border: 'none', padding: '1rem' }}>
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: 'white', p: '0.5rem', borderRadius: '8px' }}><Mail size={20} color="var(--secondary)" /></div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Support</p>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>hello@swaraajdairy.com</p>
                  </div>
               </div>
            </div>

            <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', py: '0.8rem' }}>
              <Send size={18} /> Send Message
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
