import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { ArrowLeft, Phone, Droplet, Calendar, Receipt, Edit, CheckCircle, Truck, UserCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { customers, deliveries, staff } = useContext(DataContext);

    const customer = customers.find(c => c.id === parseInt(id));

    // Get this customer's logs
    const customerLogs = [];
    Object.keys(deliveries).forEach(date => {
        const d = deliveries[date].find(log => log.customerId === parseInt(id));
        if (d) customerLogs.push({ ...d, date });
    });
    customerLogs.sort((a, b) => b.date.localeCompare(a.date));

    if (!customer) return <div className="container">Customer not found</div>;

    return (
        <div className="container page-transition">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/vendor/customers')} style={{ background: 'none', border: 'none' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Customer Profile</h1>
            </header>

            {/* Profile Info Card */}
            <div className="card-glass" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, white 0%, #f8fafc 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{customer.name}</h2>
                        <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>{customer.status}</span>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}><Edit size={18} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}><Phone size={14} /></div>
                        <span style={{ fontSize: '0.85rem' }}>{customer.phone}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}><Droplet size={14} /></div>
                        <span style={{ fontSize: '0.85rem' }}>{customer.defaultQuantity} L/day</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', gridColumn: '1 / -1' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}><Truck size={14} /></div>
                        <span style={{ fontSize: '0.85rem' }}>{customer.assignedStaffId ? `Assigned to: ${staff.find(s => s.id === customer.assignedStaffId)?.name || 'Unknown'}` : 'No Staff Assigned'}</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="stat-card">
                    <span className="stat-value">{customerLogs.length}</span>
                    <span className="stat-label">Total Drops</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">₹ {customerLogs.reduce((s, l) => s + ((l.quantity || 0) * (l.rate || 50)) + ((l.extraQuantity || 0) * (l.extraRate || 50)), 0).toFixed(0)}</span>
                    <span className="stat-label">Current Dues</span>
                </div>
            </div>

            {/* Recent Logs Section */}
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Calendar size={18} /> Delivery History
            </h3>

            <div className="stack" style={{ gap: '0.75rem' }}>
                {customerLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="card-glass" style={{ padding: '1rem' }}>
                        <div className="row-between">
                            <div>
                                <p style={{ fontWeight: '700' }}>{format(parseISO(log.date), 'MMM do, yyyy')}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.quantity} Liters delivered</p>
                            </div>
                            <CheckCircle size={20} color="var(--accent)" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>
                <Receipt size={18} /> View All Billing Records
            </button>
        </div>
    );
};

export default CustomerDetail;
