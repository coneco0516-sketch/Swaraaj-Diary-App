import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { DataContext } from '../context/DataContext';
import { LogOut, Users, Truck, Receipt, ChevronRight, ShieldCheck, Activity, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const { customers, deliveries, bills, settings } = useContext(DataContext);

  const activeCustomers = customers.filter(c => c.status === 'active');
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysDeliveries = deliveries[todayStr] || [];
  
  const pendingBillsCount = bills.filter(b => b.status === 'unpaid').length;
  const totalQuantityToday = todaysDeliveries.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="container page-transition">
      {/* Header Widget */}
      <motion.header 
        className="card-glass" 
        style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', color: 'white', border: 'none' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Dairy Console</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{settings.shopName} Hub</h1>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Welcome, {user.name || 'Vendor'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/vendor/settings')} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '10px', color: 'white', border: 'none' }}>
            <SettingsIcon size={20} />
          </button>
          <button className="btn" onClick={logout} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '10px', color: 'white' }}>
            <LogOut size={20} />
          </button>
        </div>
      </motion.header>

      {/* Stats Row - Hide for delivery staff */}
      {user.subRole !== 'delivery' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Users size={16} color="var(--secondary)" />
            </div>
            <span className="stat-value">{activeCustomers.length}</span>
            <span className="stat-label">Customers</span>
          </div>
          <div className="stat-card">
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Activity size={16} color="var(--accent)" />
            </div>
            <span className="stat-value">{totalQuantityToday}L</span>
            <span className="stat-label">Drops Today</span>
          </div>
        </div>
      )}

      {/* Main Actions List */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {user.subRole === 'delivery' ? 'Delivery Portal' : 'Quick Actions'} <ChevronRight size={16} color="var(--text-muted)" />
      </h2>
      
      <div className="stack" style={{ gap: '0.75rem' }}>
        {[
          { to: "/vendor/delivery", icon: <Truck />, label: "Daily Logs", color: "#f97316", desc: "Mark today's milk drops" },
          { to: "/vendor/customers", icon: <Users />, label: "Client Base", color: "#0ea5e9", desc: "Manage subscription details", hide: user.subRole === 'delivery' },
          { to: "/vendor/billing", icon: <Receipt />, label: "Billing", color: "#10b981", desc: "Invoices and collection", hide: user.subRole === 'delivery' },
          { to: "/vendor/staff", icon: <ShieldCheck />, label: "Store Access", color: "#6366f1", desc: "Staff portal management", hide: user.subRole !== 'owner' }
        ].filter(a => !a.hide).map((action, i) => (
          <Link key={i} to={action.to} style={{ textDecoration: 'none' }}>
            <motion.div 
              className="card-glass" 
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ background: `${action.color}15`, padding: '0.75rem', borderRadius: '12px', color: action.color }}>
                {action.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>{action.label}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{action.desc}</p>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Billing Summary Banner */}
      {pendingBillsCount > 0 && (
         <div className="card-glass" style={{ marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed rgba(239, 68, 68, 0.2)' }}>
            <div className="row-between">
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--danger)' }}>Outstanding Collection</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pendingBillsCount} bills are currently pending payment</p>
              </div>
              <Link to="/vendor/billing" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Review</Link>
            </div>
         </div>
      )}
    </div>
  );
};

export default VendorDashboard;
