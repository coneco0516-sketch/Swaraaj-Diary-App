import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const DataContext = createContext(null);

const API_URL = API_BASE_URL;

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState({});
  const [bills, setBills] = useState([]);
  const [settings, setSettings] = useState({ shopName: 'Swaraaj Dairy', milkRate: '50.0' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchCustomers(),
      fetchDeliveries(),
      fetchBills(),
      fetchSettings()
    ]);
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async (updates) => {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, ...updates }));
      }
    } catch (e) {
      console.error(e);
    }
  };
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(`${API_URL}/deliveries`);
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await fetch(`${API_URL}/bills`);
      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS ---
  const addCustomer = async (customerData) => {
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      if (res.ok) {
        const saved = await res.json();
        setCustomers(prev => [...prev, saved]);
        return saved;
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add customer');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to Server');
    }
  };

  const saveDeliveries = async (deliveriesArray) => {
    try {
      const res = await fetch(`${API_URL}/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveriesArray)
      });
      if (res.ok) {
        fetchDeliveries(); // Reload grouping
      }
    } catch (e) {
      console.error(e);
      alert('Error saving deliveries');
    }
  };

  const updateBillStatus = async (customerId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/bills/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, status: newStatus })
      });
      if (res.ok) {
        setBills(prev => prev.map(b => b.customerId === customerId ? { ...b, status: newStatus } : b));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateBills = async (month) => {
    try {
      const res = await fetch(`${API_URL}/bills/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month })
      });
      if (res.ok) {
        fetchBills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DataContext.Provider value={{
      customers, setCustomers, fetchCustomers, addCustomer,
      deliveries, setDeliveries, saveDeliveries, fetchDeliveries,
      bills, setBills, fetchBills, updateBillStatus, generateBills,
      settings, setSettings, saveSettings, fetchSettings,
      loading, setLoading, refreshAll,
      API_URL
    }}>
      {children}
    </DataContext.Provider>
  );
};
