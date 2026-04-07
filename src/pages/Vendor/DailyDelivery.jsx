import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Minus, Plus, Search, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DataContext } from '../../context/DataContext';

const DailyDelivery = () => {
  const navigate = useNavigate();
  const { customers, deliveries, setDeliveries } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  // Make sure today's deliveries exist based on active customers
  useEffect(() => {
    if (!deliveries[todayStr] && customers.length > 0) {
      const activeCustomers = customers.filter(c => c.status === 'active');
      const initialDeliveries = activeCustomers.map(c => ({
        customerId: c.id,
        quantity: parseFloat(c.defaultQuantity),
        status: 'pending'
      }));
      setDeliveries(prev => ({
        ...prev,
        [todayStr]: initialDeliveries
      }));
    }
  }, [customers, deliveries, setDeliveries, todayStr]);

  const todayData = deliveries[todayStr] || [];

  const handleUpdate = (customerId, change) => {
    setDeliveries(prev => {
      const updated = prev[todayStr].map(item => 
        item.customerId === customerId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      );
      return { ...prev, [todayStr]: updated };
    });
  };

  const handleStatus = (customerId) => {
    setDeliveries(prev => {
      const updated = prev[todayStr].map(item => 
        item.customerId === customerId ? { ...item, status: item.status === 'pending' ? 'delivered' : 'pending' } : item
      );
      return { ...prev, [todayStr]: updated };
    });
  };

  // Join with customer details
  const displayData = todayData.map(delivery => {
    const customer = customers.find(c => c.id === delivery.customerId) || {};
    return {
      ...delivery,
      name: customer.name || 'Unknown',
      phone: customer.phone || 'N/A'
    };
  });

  const filtered = displayData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSync = async () => {
    await saveDeliveries(todayData);
    alert("Logs synced with Server");
  };

  const pendingCount = todayData.filter(i => i.status === 'pending').length;

  return (
    <div style={{ padding: '1rem', flex: 1 }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem',
        padding: '1rem 0'
      }}>
        <button className="btn" onClick={() => navigate('/vendor')} style={{ background: 'none' }}>
           <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Daily Delivery Log</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{format(new Date(), 'EEEE, dd MMM yyyy')}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', background: '#fef3c7' }}>
           <Clock size={20} color="#d97706" style={{ margin: '0 0.5rem 0.5rem 0' }} />
           <p style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '600' }}>PENDING</p>
           <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{pendingCount}</h3>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', background: '#d1fae5' }}>
           <CheckCircle size={20} color="#059669" style={{ margin: '0 0.5rem 0.5rem 0' }} />
           <p style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: '600' }}>DELIVERED</p>
           <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{todayData.length - pendingCount}</h3>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search by customer name..." 
          style={{ paddingLeft: '3rem', width: '100%' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: '1rem', paddingBottom: '80px' }}>
        {filtered.map(item => (
          <div key={item.customerId} className="card" style={{ 
            opacity: item.status === 'delivered' ? 0.7 : 1,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem'
          }}>
            <div>
              <h4 style={{ fontWeight: '600' }}>{item.name}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.phone}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <button className="btn" onClick={() => handleUpdate(item.customerId, -0.5)} style={{ padding: '0.25rem', background: '#f1f5f9' }}><Minus size={16} /></button>
                 <span style={{ fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{item.quantity} L</span>
                 <button className="btn" onClick={() => handleUpdate(item.customerId, 0.5)} style={{ padding: '0.25rem', background: '#f1f5f9' }}><Plus size={16} /></button>
              </div>
              <button 
                className={`btn ${item.status === 'delivered' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem' }}
                onClick={() => handleStatus(item.customerId)}
              >
                <CheckCircle size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: '90px', left: '1rem', right: '1rem', zIndex: 10 }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)' }}
          onClick={handleSync}
        >
          <CheckCircle size={20} /> Save Today's Logs
        </button>
      </div>
    </div>
  );
};

export default DailyDelivery;
