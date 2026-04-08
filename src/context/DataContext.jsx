import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const DataContext = createContext(null);

const API_URL = API_BASE_URL;

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState({});
  const [bills, setBills] = useState([]);
  const [staff, setStaff] = useState([]);
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
      fetchStaff()
    ]);
    setLoading(false);
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers?_t=${Date.now()}`);
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
      const res = await fetch(`${API_URL}/deliveries?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await fetch(`${API_URL}/bills?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setBills(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS ---
  const addCustomer = async (customerData) => {
    try {
      const payload = { ...customerData };
      if (payload.assignedStaffId) {
          payload.assignedStaffId = parseInt(payload.assignedStaffId);
      }
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        const fullCustomer = { ...payload, id: saved.id };
        setCustomers(prev => [...prev, fullCustomer]);
        return fullCustomer;
      } else {
        const err = await res.json();
        alert(err.error || err.detail || 'Failed to add customer');
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
        return true;
      }
    } catch (e) {
      console.error(e);
      alert('Error saving deliveries');
    }
    return false;
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

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_URL}/staff?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addStaff = async (staffData) => {
    try {
      const res = await fetch(`${API_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData)
      });
      if (res.ok) {
        await fetchStaff();
        return true;
      } else {
        const err = await res.json();
        alert(err.detail || 'Error adding staff');
      }
    } catch (e) {
      console.error(e);
      alert('Error adding staff');
    }
    return false;
  };

  const removeStaff = async (phone) => {
    try {
      const res = await fetch(`${API_URL}/staff/${phone}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchStaff();
        return true;
      }
    } catch (e) {
      console.error(e);
      alert('Error removing staff');
    }
    return false;
  };

  return (
    <DataContext.Provider value={{
      customers, setCustomers, fetchCustomers, addCustomer,
      deliveries, setDeliveries, saveDeliveries, fetchDeliveries,
      bills, setBills, fetchBills, updateBillStatus, generateBills,
      staff, setStaff, fetchStaff, addStaff, removeStaff,
      loading, setLoading, refreshAll,
      API_URL
    }}>
      {children}
    </DataContext.Provider>
  );
};
