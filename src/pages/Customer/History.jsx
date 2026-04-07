import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { UserContext } from '../../context/UserContext';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const { deliveries, customers } = useContext(DataContext);
  const { user } = useContext(UserContext);

  const me = customers.find(c => c.phone === user?.phone);
  
  // Flatten deliveries for this customer
  const myDeliveries = [];
  Object.keys(deliveries).forEach(date => {
    const d = deliveries[date].find(item => item.customerId === me?.id);
    if (d) myDeliveries.push({ ...d, date });
  });

  // Sort by date descending
  myDeliveries.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="container page-transition">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Delivery logs</h1>
        <p className="text-muted">Tracking your recent milk drops</p>
      </header>

      <div className="stack">
        {myDeliveries.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Calendar size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p className="text-muted">No delivery logs found yet.</p>
          </div>
        ) : (
          myDeliveries.map((d, i) => (
            <motion.div 
              key={i} 
              className="card-glass" 
              style={{ padding: '1.25rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="row-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                    <Calendar size={20} color="var(--secondary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{format(parseISO(d.date), 'MMMM do, yyyy')}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity: {d.quantity} Liters</p>
                  </div>
                </div>
                {d.status === 'delivered' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <CheckCircle2 size={16} /> Delivered
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <Clock size={16} /> Pending
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
