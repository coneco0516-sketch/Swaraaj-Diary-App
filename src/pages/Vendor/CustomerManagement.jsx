import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Search, Phone, Droplet, User, Edit } from 'lucide-react';
import { DataContext } from '../../context/DataContext';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const { customers, addCustomer } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', defaultQuantity: '1.5' });

  const handleAdd = async (e) => {
    e.preventDefault();
    await addCustomer({ ...newCustomer, status: 'active' });
    setIsAddMode(false);
    setNewCustomer({ name: '', phone: '', defaultQuantity: '1.5' });
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div style={{ padding: '1rem', flex: 1, position: 'relative' }}>
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Customer Management</h2>
      </header>

      {isAddMode ? (
        <form onSubmit={handleAdd} className="card fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Add New Customer</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Name</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={newCustomer.name}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                required 
              />
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Phone Number</label>
              <input 
                type="tel" 
                placeholder="10 digit number" 
                value={newCustomer.phone}
                onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                required 
              />
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Default Quantity (Liters)</label>
              <select 
                value={newCustomer.defaultQuantity}
                onChange={e => setNewCustomer({...newCustomer, defaultQuantity: e.target.value})}
              >
                <option value="0.5">0.5 L</option>
                <option value="1.0">1.0 L</option>
                <option value="1.5">1.5 L</option>
                <option value="2.0">2.0 L</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Customer</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddMode(false)}>Cancel</button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              style={{ paddingLeft: '3rem', width: '100%' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {filtered.map(c => (
              <div key={c.id} className="card-glass" 
                 onClick={() => navigate(`/vendor/customers/${c.id}`)}
                 style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer'
                 }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'rgba(14, 165, 233, 0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: 'var(--text-main)' }}>{c.name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                       <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={12} /> {c.phone}
                       </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                   <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>{c.status.toUpperCase()}</span>
                   <ChevronRight size={18} color="#cbd5e1" />
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => setIsAddMode(true)}
            style={{ 
              position: 'fixed', 
              bottom: '2rem', 
              right: '2rem', 
              borderRadius: '50%', 
              width: '56px', 
              height: '56px', 
              padding: 0,
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)'
            }}
          >
            <UserPlus size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default CustomerManagement;
