import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Minus, Plus, Search, CheckCircle, Clock, UserPlus, X, BadgeIndianRupee, PackagePlus } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { UserContext } from '../../context/UserContext';

const DailyDelivery = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { customers, deliveries, setDeliveries, saveDeliveries, loading, staff, addCustomer } = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isQuickAdd, setIsQuickAdd] = useState(false);
    const [quickCustomer, setQuickCustomer] = useState({ name: '', phone: '', defaultQuantity: '1.5', rate: '50' });

    const currentStaff = staff.find(s => s.phone === user.phone);
    const staffId = currentStaff?.id;
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        if (!deliveries[todayStr] && customers.length > 0) {
            let filteredCustomers = customers.filter(c => c.status === 'active');
            if (user.subRole === 'staff' && staffId) {
                filteredCustomers = filteredCustomers.filter(c => c.assignedStaffId === staffId);
            }

            const initialDeliveries = filteredCustomers.map(c => ({
                customerId: c.id,
                quantity: parseFloat(c.defaultQuantity),
                rate: parseFloat(c.rate || 50),
                extraQuantity: 0,
                extraRate: parseFloat(c.rate || 50),
                status: 'pending'
            }));
            setDeliveries(prev => ({ ...prev, [todayStr]: initialDeliveries }));
        }
    }, [customers, deliveries, setDeliveries, todayStr, user, staffId]);

    const todayData = deliveries[todayStr] || [];

    const handleUpdate = (customerId, field, value) => {
        setDeliveries(prev => {
            const updated = prev[todayStr].map(item => 
                item.customerId === customerId ? { ...item, [field]: value } : item
            );
            return { ...prev, [todayStr]: updated };
        });
    };

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        const saved = await addCustomer({ ...quickCustomer, assignedStaffId: staffId, status: 'active' });
        if (saved) {
            setDeliveries(prev => {
                const updated = [...(prev[todayStr] || []), {
                    customerId: saved.id,
                    quantity: parseFloat(quickCustomer.defaultQuantity),
                    rate: parseFloat(quickCustomer.rate),
                    extraQuantity: 0,
                    extraRate: parseFloat(quickCustomer.rate),
                    status: 'delivered'
                }];
                return { ...prev, [todayStr]: updated };
            });
            setIsQuickAdd(false);
            setQuickCustomer({ name: '', phone: '', defaultQuantity: '1.5', rate: '50' });
        }
    };

    const handleSync = async () => {
        const payload = todayData.map(d => ({ ...d, date: todayStr, staffId }));
        const success = await saveDeliveries(payload);
        if (success) alert("Logs synced with Server");
    };

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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div style={{ padding: '1rem', flex: 1, minHeight: '100vh', background: 'var(--bg-main)', color: 'white' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button className="btn" onClick={() => navigate('/vendor')} style={{ background: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Route Delivery Log</h2>
                    <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>{format(new Date(), 'EEEE, dd MMM')}</p>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={20} />
                    <input type="text" placeholder="Search customer..." style={{ paddingLeft: '3rem', width: '100%' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button className="btn btn-secondary" onClick={() => setIsQuickAdd(true)} style={{ padding: '0.75rem' }}>
                    <UserPlus size={20} />
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', paddingBottom: '140px' }}>
                {filtered.map(item => (
                    <div key={item.customerId} className="card-glass" style={{ borderLeft: item.status === 'delivered' ? '4px solid var(--accent)' : '4px solid #475569' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <h4 style={{ fontWeight: '700' }}>{item.name}</h4>
                                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{item.phone}</span>
                            </div>
                            <button 
                                className={`btn ${item.status === 'delivered' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => handleUpdate(item.customerId, 'status', item.status === 'pending' ? 'delivered' : 'pending')}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                            >
                                {item.status === 'delivered' ? 'DELIVERED' : 'PENDING'}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'grid', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: '600', opacity: 0.6 }}>BASE QUANTITY (L)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button className="btn-mini" onClick={() => handleUpdate(item.customerId, 'quantity', Math.max(0, item.quantity - 0.5))}><Minus size={12} /></button>
                                    <span style={{ fontWeight: '800' }}>{item.quantity}</span>
                                    <button className="btn-mini" onClick={() => handleUpdate(item.customerId, 'quantity', item.quantity + 0.5)}><Plus size={12} /></button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.65rem', fontWeight: '600', opacity: 0.6 }}>BASE RATE (₹/L)</label>
                                <input 
                                    type="number" 
                                    value={item.rate} 
                                    onChange={(e) => handleUpdate(item.customerId, 'rate', parseFloat(e.target.value))}
                                    style={{ padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)' }}
                                />
                            </div>
                        </div>

                        {/* Extra Milk Section */}
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <PackagePlus size={14} /> EXTRA MILK (OPTIONAL)
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'grid', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: '600', opacity: 0.6 }}>EXTRA QTY (L)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button className="btn-mini" onClick={() => handleUpdate(item.customerId, 'extraQuantity', Math.max(0, item.extraQuantity - 0.5))}><Minus size={12} /></button>
                                        <span style={{ fontWeight: '800' }}>{item.extraQuantity}</span>
                                        <button className="btn-mini" onClick={() => handleUpdate(item.customerId, 'extraQuantity', item.extraQuantity + 0.5)}><Plus size={12} /></button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: '600', opacity: 0.6 }}>EXTRA RATE (₹/L)</label>
                                    <input 
                                        type="number" 
                                        value={item.extraRate} 
                                        onChange={(e) => handleUpdate(item.customerId, 'extraRate', parseFloat(e.target.value))}
                                        style={{ padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isQuickAdd && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={{ width: '100%', background: 'var(--bg-main)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Quick Add Household</h3>
                                <button onClick={() => setIsQuickAdd(false)} style={{ background: 'none', color: 'white' }}><X /></button>
                            </div>
                            <form onSubmit={handleQuickAdd} style={{ display: 'grid', gap: '1rem' }}>
                                <input type="text" placeholder="House Name" required value={quickCustomer.name} onChange={e => setQuickCustomer({...quickCustomer, name: e.target.value})} />
                                <input type="tel" placeholder="Phone" required value={quickCustomer.phone} onChange={e => setQuickCustomer({...quickCustomer, phone: e.target.value})} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="number" placeholder="Qty (L)" required value={quickCustomer.defaultQuantity} onChange={e => setQuickCustomer({...quickCustomer, defaultQuantity: e.target.value})} />
                                    <input type="number" placeholder="Rate (₹)" required value={quickCustomer.rate} onChange={e => setQuickCustomer({...quickCustomer, rate: e.target.value})} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>Add & Mark Delivered</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ position: 'fixed', bottom: '90px', left: '1rem', right: '1rem', zIndex: 10 }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '16px', boxShadow: '0 8px 32px var(--primary)' }} onClick={handleSync}>
                    <CheckCircle size={20} /> Save Combined Delivery Logs
                </button>
            </div>
        </div>
    );
};

export default DailyDelivery;
