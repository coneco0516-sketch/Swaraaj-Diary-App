import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { DataContext } from '../context/DataContext';
import { LogOut, Calendar, Receipt, Droplet, User } from 'lucide-react';
import { format } from 'date-fns';

const CustomerDashboard = () => {
  const { user, logout } = useContext(UserContext);
  const { customers, deliveries, bills } = useContext(DataContext);

  const customer = customers.find(c => c.phone === user.phone) || {
     name: 'Guest User',
     defaultQuantity: 1.5,
     id: null
  };

  const customerBills = bills.filter(b => b.customerId === customer.id);
  const currentBill = customerBills.length > 0 ? customerBills[0] : { amount: 0, totalQuantity: 0 };

  // Generate recent deliveries from global object
  const recentDeliveries = [];
  Object.keys(deliveries).forEach(dateStr => {
     const dayDeliveries = deliveries[dateStr];
     const myDelivery = dayDeliveries.find(d => d.customerId === customer.id);
     if (myDelivery) {
       recentDeliveries.push({ date: dateStr, quantity: `${myDelivery.quantity} L`, status: myDelivery.status });
     }
  });

  return (
    <div style={{ padding: '1rem', flex: 1 }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--primary)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Swaraaj Milk Dairy</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Welcome, {customer.name !== 'Guest User' ? customer.name : user.phone}</p>
          </div>
        </div>
        <button onClick={logout} className="btn" style={{ padding: '0.5rem', background: '#fee2e2', color: '#ef4444' }}>
          <LogOut size={20} />
        </button>
      </header>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ 
          background: 'var(--primary)', 
          color: 'white',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Monthly Bill {currentBill.status === 'paid' ? '(Paid)' : '(Pending)'}</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>₹ {currentBill.amount.toFixed(2)}</h3>
            <p style={{ opacity: 0.8, fontSize: '0.75rem', marginTop: '0.5rem' }}>For {currentBill.totalQuantity}L @ ₹50 / L</p>
          </div>
          <Receipt size={48} style={{ opacity: 0.2 }} />
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
             <Droplet size={20} color="var(--primary)" />
             <h4 style={{ fontWeight: '600' }}>My Subscription</h4>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Default Quantity</p>
              <p style={{ fontWeight: '600' }}>{customer.defaultQuantity} Liters / Day</p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Change</button>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={20} />
        Recent Deliveries
      </h3>
      <div className="card" style={{ padding: '0.5rem' }}>
        <ul style={{ listStyle: 'none' }}>
          {recentDeliveries.length > 0 ? recentDeliveries.reverse().map((delivery, i) => (
            <li key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '1rem', 
              borderBottom: i === recentDeliveries.length - 1 ? 'none' : '1px solid var(--border)' 
            }}>
              <span style={{ fontWeight: '500' }}>{format(new Date(delivery.date), 'dd MMM yyyy')}</span>
              <span className={`badge ${delivery.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>{delivery.quantity}</span>
            </li>
          )) : (
            <li style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No recent deliveries found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomerDashboard;
