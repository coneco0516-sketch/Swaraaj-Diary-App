import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Receipt, Download, RefreshCw, CheckCircle, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { DataContext } from '../../context/DataContext';

const Billing = () => {
  const navigate = useNavigate();
  const { customers, bills, updateBillStatus, generateBills } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');

  const currentMonth = format(new Date(), 'yyyy-MM');

  const handleGenerate = async () => {
    if (window.confirm(`Update all bills for ${currentMonth} based on latest logs?`)) {
      await generateBills(currentMonth);
      alert("Invoices updated successfully!");
    }
  };

  const handleExport = () => {
    try {
      const headers = "Customer,Phone,Quantity,Amount,Status\n";
      const rows = filtered.map(item => 
        `"${item.name}","${item.phone}",${item.totalQuantity},${item.amount},"${item.status}"`
      ).join("\n");
      const blob = new Blob([headers + (rows.length ? rows : "")], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `swaraaj_billing_${currentMonth}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      alert("Export failed");
    }
  };

  const toggleStatus = (customerId) => {
    const bill = bills.find(b => b.customerId === customerId);
    if (!bill) return;
    const newStatus = bill.status === 'unpaid' ? 'paid' : 'unpaid';
    updateBillStatus(customerId, newStatus);
  };

  const displayData = bills.map(bill => {
      const customer = customers.find(c => c.id === bill.customerId) || {};
      return {
          ...bill,
          name: customer.name || 'Unknown',
          phone: customer.phone || 'N/A'
      };
  });

  const filtered = displayData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEarnings = bills.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingEarnings = bills.filter(i => i.status === 'unpaid').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ padding: '1rem', flex: 1 }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/vendor')} style={{ background: 'none' }}>
             <ArrowLeft size={24} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Monthly Billing</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{format(new Date(), 'MMMM yyyy')}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
           Generate
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem' }}>
          <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Total Monthly Revenue</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>₹ {totalEarnings}</h3>
        </div>
        <div className="card" style={{ background: '#ffffff', padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Payments</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--danger)' }}>₹ {pendingEarnings}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search by customer..." 
            style={{ paddingLeft: '3rem', width: '100%' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={fetchBills}><RefreshCw size={20} /></button>
        <button className="btn btn-secondary" onClick={handleExport} title="Export CSV"><Download size={20} /></button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filtered.map(item => (
          <div key={item.customerId} className="card" style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                  <h4 style={{ fontWeight: '600' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.phone}</p>
               </div>
               <span className={`badge ${item.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>{item.status.toUpperCase()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.3)', padding: '1rem', borderRadius: '8px' }}>
               <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Usage: {item.totalQuantity} L @ ₹50</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>₹ {item.amount}</p>
               </div>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Download Invoice"><Download size={18} /></button>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Send WhatsApp"><Smartphone size={18} /></button>
                  <button 
                    className={`btn ${item.status === 'paid' ? 'btn-secondary' : 'btn-primary'}`} 
                    style={{ padding: '0.5rem' }}
                    onClick={() => toggleStatus(item.customerId)}
                  >
                    <CheckCircle size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
