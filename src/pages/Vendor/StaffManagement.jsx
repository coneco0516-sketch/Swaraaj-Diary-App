import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { ArrowLeft, UserPlus, ShieldPlus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SERVER_URL } from '../../config';

const StaffManagement = () => {
  const { user } = useContext(UserContext);
  const [staff, setStaff] = useState([]);
  
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    subRole: 'delivery'
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/staff`);
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newStaff.name && newStaff.phone.length === 10) {
      try {
        const res = await fetch(`${SERVER_URL}/api/staff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStaff)
        });
        if (res.ok) {
           fetchStaff();
           setNewStaff({ name: '', phone: '', subRole: 'delivery' });
        } else {
           alert('Phone number already in use or error');
        }
      } catch (err) {
         console.error(err);
      }
    }
  };

  const handleRemove = async (phoneToRemove) => {
    if (staff.find(s => s.phone === phoneToRemove)?.subRole === 'owner') {
      alert("Cannot remove the Owner.");
      return;
    }
    try {
      await fetch(`${SERVER_URL}/api/staff/${phoneToRemove}`, { method: 'DELETE' });
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/vendor" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Staff Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage shop and delivery incharge access</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <ShieldPlus size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Add Staff Member</h2>
          </div>
          
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Staff Name" 
                value={newStaff.name}
                onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Phone Number (for Login)</label>
              <input 
                type="tel" 
                placeholder="10 digit number" 
                value={newStaff.phone}
                onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                maxLength={10}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Assign Role</label>
              <select 
                value={newStaff.subRole}
                onChange={(e) => setNewStaff({...newStaff, subRole: e.target.value})}
              >
                <option value="delivery">Delivery Incharge (Only log delivery)</option>
                <option value="shop">Shop Incharge (Manage Customers & Bills)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Add Member
            </button>
          </form>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Active Staff Profiles</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {staff.map((s, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                <div>
                  <h3 style={{ fontWeight: '600' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.phone}</p>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem', 
                    background: s.subRole === 'owner' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: s.subRole === 'owner' ? 'var(--primary-dark)' : 'var(--accent)',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginTop: '0.5rem',
                    textTransform: 'capitalize'
                  }}>
                    {s.subRole}
                  </span>
                </div>
                {s.subRole !== 'owner' && (
                  <button 
                    onClick={() => handleRemove(s.phone)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
