import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Minus, Plus, Search, CheckCircle, Clock, UserPlus, X } from 'lucide-react';
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
    const [quickCustomer, setQuickCustomer] = useState({ name: '', phone: '', defaultQuantity: '1.5' });

    // Find actual staff ID from staff list based on phone
    const currentStaff = staff.find(s => s.phone === user.phone);
    const staffId = currentStaff?.id;
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        if (!deliveries[todayStr] && customers.length > 0) {
            let filteredCustomers = customers.filter(c => c.status === 'active');
            
            // If staff member is logged in, only show their assigned households
            if (user.subRole === 'staff' && staffId) {
                filteredCustomers = filteredCustomers.filter(c => c.assignedStaffId === staffId);
            }

            const initialDeliveries = filteredCustomers.map(c => ({
                customerId: c.id,
                quantity: parseFloat(c.defaultQuantity),
                status: 'pending'
            }));
            setDeliveries(prev => ({
                ...prev,
                [todayStr]: initialDeliveries
            }));
        }
    }, [customers, deliveries, setDeliveries, todayStr, user, staffId]);

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

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        const saved = await addCustomer({ ...quickCustomer, assignedStaffId: staffId, status: 'active' });
        if (saved) {
            // Add new customer to today's local log immediately
            setDeliveries(prev => {
                const updated = [...(prev[todayStr] || []), {
                    customerId: saved.id,
                    quantity: parseFloat(quickCustomer.defaultQuantity),
                    status: 'delivered'
                }];
                return { ...prev, [todayStr]: updated };
            });
            setIsQuickAdd(false);
            setQuickCustomer({ name: '', phone: '', defaultQuantity: '1.5' });
        }
    };

    const handleSync = async () => {
        // Include staff info in payload
        const payload = todayData.map(d => ({ ...d, staffId }));
        await saveDeliveries(payload);
        alert("Logs synced with Server");
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

    const pendingCount = todayData.filter(i => i.status === 'pending').length;

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'white' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%' }} />
                <p style={{ marginTop: '1rem', opacity: 0.6 }}>Loading Delivery Logs...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem', flex: 1, minHeight: '100vh', background: 'var(--bg-main)', color: 'white' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button className="btn" onClick={() => navigate('/vendor')} style={{ background: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Route Delivery Log</h2>
                    <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>{format(new Date(), 'EEEE, dd MMM')}</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card-glass" style={{ textAlign: 'center' }}>
                    <Clock size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>PENDING</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{pendingCount}</h3>
                </div>
                <div className="card-glass" style={{ textAlign: 'center' }}>
                    <CheckCircle size={20} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>DELIVERED</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{todayData.length - pendingCount}</h3>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={20} />
                    <input type="text" placeholder="Search customer..." style={{ paddingLeft: '3rem', width: '100%' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button className="btn btn-secondary" onClick={() => setIsQuickAdd(true)} style={{ padding: '0.75rem' }}>
                    <UserPlus size={20} />
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem', paddingBottom: '120px' }}>
                {filtered.map(item => (
                    <div key={item.customerId} className="card-glass" style={{ opacity: item.status === 'delivered' ? 0.6 : 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ fontWeight: '600' }}>{item.name}</h4>
                            <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>{item.phone}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button className="btn" onClick={() => handleUpdate(item.customerId, -0.5)} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem' }}><Minus size={14} /></button>
                                <span style={{ fontWeight: '700', minWidth: '45px', textAlign: 'center' }}>{item.quantity}L</span>
                                <button className="btn" onClick={() => handleUpdate(item.customerId, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem' }}><Plus size={14} /></button>
                            </div>
                            <button className={`btn ${item.status === 'delivered' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem' }} onClick={() => handleStatus(item.customerId)}>
                                <CheckCircle size={20} />
                            </button>
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
                            <form onSubmit={handleQuickAdd} style={{ display: 'grid', gap: '1.25rem' }}>
                                <input type="text" placeholder="House Name / Owner" required value={quickCustomer.name} onChange={e => setQuickCustomer({...quickCustomer, name: e.target.value})} />
                                <input type="tel" placeholder="Phone Number" required value={quickCustomer.phone} onChange={e => setQuickCustomer({...quickCustomer, phone: e.target.value})} />
                                <select value={quickCustomer.defaultQuantity} onChange={e => setQuickCustomer({...quickCustomer, defaultQuantity: e.target.value})}>
                                    <option value="0.5">0.5 Liters</option>
                                    <option value="1.0">1.0 Liters</option>
                                    <option value="1.5">1.5 Liters</option>
                                    <option value="2.0">2.0 Liters</option>
                                </select>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', width: '100%' }}>Add & Mark Delivered Today</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ position: 'fixed', bottom: '90px', left: '1rem', right: '1rem', zIndex: 10 }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '16px', boxShadow: '0 8px 32px var(--primary)' }} onClick={handleSync}>
                    <CheckCircle size={20} /> Save My Route Logs
                </button>
            </div>
        </div>
    );
};

export default DailyDelivery;
