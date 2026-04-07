import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, CreditCard, Bell, Shield, ChevronRight, Save } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { motion } from 'framer-motion';

const Settings = () => {
    const navigate = useNavigate();
    const { settings, saveSettings } = useContext(DataContext);
    const [shopName, setShopName] = useState(settings.shopName);
    const [rate, setRate] = useState(settings.milkRate);

    const handleSave = async () => {
        await saveSettings({ shopName, milkRate: rate });
        alert("Settings saved successfully!");
    };

    return (
        <div className="container page-transition">
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/vendor')} style={{ background: 'none', border: 'none', color: 'var(--text-main)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Store Settings</h1>
            </header>

            <div className="stack" style={{ gap: '1.5rem' }}>
                <motion.div className="card-glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase' }}>Shop Identity</h3>
                    <div className="input-group">
                        <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Store size={14} /> Shop Name
                        </label>
                        <input 
                            type="text" 
                            value={shopName} 
                            onChange={(e) => setShopName(e.target.value)}
                        />
                    </div>
                </motion.div>

                <motion.div className="card-glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase' }}>Pricing & Metrics</h3>
                    <div className="input-group">
                        <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={14} /> Global Milk Rate (₹/L)
                        </label>
                        <input 
                            type="number" 
                            value={rate} 
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>
                </motion.div>

                <div className="stack" style={{ gap: '0.75rem' }}>
                    {[
                        { icon: <Bell size={18} color="var(--primary)" />, label: 'Notification Settings' },
                        { icon: <Shield size={18} color="var(--accent)" />, label: 'Security & Access' }
                    ].map((item, i) => (
                        <div key={i} className="card-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {item.icon}
                                <span style={{ fontWeight: '600' }}>{item.label}</span>
                            </div>
                            <ChevronRight size={18} color="#cbd5e1" />
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                    <Save size={18} /> Update Store Profile
                </button>
            </div>
        </div>
    );
};

export default Settings;
