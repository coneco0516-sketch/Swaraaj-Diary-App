import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Clock, CheckCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { DataContext } from '../../context/DataContext';

const StaffReports = () => {
    const navigate = useNavigate();
    const { customers, deliveries, staff, loading } = useContext(DataContext);
    const [selectedStaff, setSelectedStaff] = useState('all');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const todayLogs = deliveries[selectedDate] || [];

    // Filter logs by staff
    const filteredLogs = selectedStaff === 'all' 
        ? todayLogs 
        : todayLogs.filter(log => log.staffId === parseInt(selectedStaff));

    // Map logs to detailed view
    const detailedLogs = filteredLogs.map(log => {
        const customer = customers.find(c => c.id === log.customerId) || {};
        const staffMember = staff.find(s => s.id === log.staffId) || { name: 'Admin/Unassigned' };
        return { ...log, customerName: customer.name, staffName: staffMember.name };
    });

    if (loading) return <div className="container">Loading reports...</div>;

    return (
        <div className="container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/vendor')} className="btn" style={{ background: 'none' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Route Tracking Reports</h1>
            </header>

            {/* Filters */}
            <div className="card-glass" style={{ marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.6 }}>Filter by Staff Name</label>
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <select 
                            style={{ paddingLeft: '2.5rem' }}
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                        >
                            <option value="all">All Delivery Personnel</option>
                            {staff.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.6 }}>Select Date</label>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                    />
                </div>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="stat-card">
                    <span className="stat-value">{detailedLogs.length}</span>
                    <span className="stat-label">Total Drops</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{detailedLogs.reduce((s,l) => s + l.quantity, 0)}L</span>
                    <span className="stat-label">Total Quantity</span>
                </div>
            </div>

            {/* Results */}
            <div className="stack" style={{ gap: '1rem' }}>
                {detailedLogs.length > 0 ? detailedLogs.map((log, i) => (
                    <div key={i} className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ fontWeight: '700' }}>{log.customerName}</h4>
                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Assigned Staff: {log.staffName}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{log.quantity} L</span>
                            <div style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                                {log.status === 'delivered' ? <CheckCircle size={12} color="var(--accent)" /> : <Clock size={12} color="var(--primary)" />}
                                {log.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                        No delivery logs found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
}

export default StaffReports;
