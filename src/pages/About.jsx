import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion } from 'framer-motion';
import { Shield, Heart, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="page-transition" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div className="container" style={{ marginTop: '1rem' }}>
        <motion.div 
          className="card-glass" 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Pure & Simple.</h1>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Swaraaj Milk Dairy is where tradition meets modern convenience. We bring the farm's freshness directly to your home through a transparent and reliable digital bridge.
          </p>

          <div className="stack" style={{ gap: '1.25rem' }}>
             {[
               { icon: <Shield size={20} color="var(--primary)" />, title: "Fully Verified", desc: "No adulteration, ever." },
               { icon: <Heart size={20} color="var(--danger)" />, title: "Local Love", desc: "Supporting local dairy farmers." },
               { icon: <Award size={20} color="var(--accent)" />, title: "Top Quality", desc: "Premium high-fat milk." }
             ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                   <div style={{ background: 'var(--bg-soft)', p: '0.75rem', borderRadius: '12px' }}>{item.icon}</div>
                   <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
