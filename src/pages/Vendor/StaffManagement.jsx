import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { UserContext } from '../../context/UserContext';
import { ArrowLeft, ShieldPlus, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffManagement = () => {
  const { user } = useContext(UserContext);
  const { staff, addStaff, removeStaff, fetchStaff } = useContext(DataContext);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', subRole: 'delivery' });
  const [status, setStatus] = useState({ type: '', msg: '' }); // type: 'success' | 'error'
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (!newStaff.name.trim()) {
      setStatus({ type: 'error', msg: 'Please enter the staff name.' });
      return;
    }
    if (newStaff.phone.trim().length < 10) {
      setStatus({ type: 'error', msg: 'Phone number must be at least 10 digits.' });
      return;
    }

    setSaving(true);
    try {
      const success = await addStaff({
        name: newStaff.name.trim(),
        phone: newStaff.phone.trim(),
        subRole: newStaff.subRole
      });

      if (success) {
        const savedName = newStaff.name;
        setNewStaff({ name: '', phone: '', subRole: 'delivery' });
        setStatus({ type: 'success', msg: `${savedName} added successfully!` });
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      } else {
        setStatus({ type: 'error', msg: 'Failed to add staff. Phone number may already be in use.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Could not connect to server. Check your internet.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (s) => {
    if (s.subRole === 'owner') { setStatus({ type: 'error', msg: 'Cannot remove the Owner.' }); return; }
    if (!window.confirm(`Remove ${s.name} from staff?`)) return;
    try {
      const success = await removeStaff(s.phone);
      if (success) {
        setStatus({ type: 'success', msg: `${s.name} removed.` });
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      } else {
        setStatus({ type: 'error', msg: 'Failed to remove staff member.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to remove staff member.' });
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add and manage delivery personnel</p>
        </div>
      </div>

      {/* Status Banner */}
      {status.msg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem',
          background: status.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: status.type === 'success' ? '#059669' : '#dc2626',
          border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
        }}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{status.msg}</span>
        </div>
      )}

      {/* Add Staff Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <ShieldPlus size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Add New Staff Member</h2>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Raju Kumar"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Phone Number * (Used for Login)
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value.replace(/\D/g, '') })}
              maxLength={12}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Assign Role *
            </label>
            <select
              value={newStaff.subRole}
              onChange={(e) => setNewStaff({ ...newStaff, subRole: e.target.value })}
            >
              <option value="delivery">Delivery Incharge (Logs Delivery Only)</option>
              <option value="shop">Shop Incharge (Manage Customers & Bills)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', width: '100%', padding: '1rem' }}
            disabled={saving}
          >
            {saving ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldPlus size={18} />}
            {saving ? ' Adding...' : ' Add Staff Member'}
          </button>
        </form>
      </div>

      {/* Staff List */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          Active Staff ({staff.length})
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {staff.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No staff added yet.</p>
          ) : staff.map((s) => (
            <div key={s.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem', background: 'var(--bg-soft)', borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>{s.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.phone}</p>
                <span style={{
                  display: 'inline-block', padding: '0.2rem 0.6rem', marginTop: '0.4rem',
                  background: s.subRole === 'owner' ? 'rgba(234,88,12,0.1)' : 'rgba(16,185,129,0.1)',
                  color: s.subRole === 'owner' ? 'var(--primary-dark)' : '#059669',
                  borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase'
                }}>
                  {s.subRole}
                </span>
              </div>
              {s.subRole !== 'owner' && (
                <button
                  onClick={() => handleRemove(s)}
                  style={{ background: 'rgba(239,68,68,0.08)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.6rem', borderRadius: '10px' }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StaffManagement;
