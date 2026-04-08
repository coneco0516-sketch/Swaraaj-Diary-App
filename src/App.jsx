import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import Login from './pages/Login';
import VendorDashboard from './pages/VendorDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerManagement from './pages/Vendor/CustomerManagement';
import DailyDelivery from './pages/Vendor/DailyDelivery';
import Billing from './pages/Vendor/Billing';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import StaffManagement from './pages/Vendor/StaffManagement';
import CustomerDetail from './pages/Vendor/CustomerDetail';
import StaffReports from './pages/Vendor/StaffReports';
import History from './pages/Customer/History';
import Profile from './pages/Customer/Profile';
import { UserContext } from './context/UserContext';
import { DataProvider } from './context/DataContext';
import MainLayout from './components/MainLayout';
import './index.css';

const NativeNavigation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
            const currentPath = window.location.pathname;
            if (currentPath === '/vendor' || currentPath === '/customer' || currentPath === '/home' || currentPath === '/login' || currentPath === '/') {
                if (window.confirm("Do you want to exit the app?")) {
                  CapApp.exitApp();
                }
            } else {
                navigate(-1);
            }
        });
        return () => { handler.then(h => h.remove()); };
    }, [navigate]);

    return null;
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('swaraaj_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('swaraaj_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('swaraaj_user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <DataProvider>
        <Router>
          <NativeNavigation />
          <MainLayout>
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'vendor' ? '/vendor' : '/customer'} />} />
              
              {/* Vendor Routes */}
              <Route path="/vendor" element={user?.role === 'vendor' ? <VendorDashboard /> : <Navigate to="/login" />} />
              <Route path="/vendor/customers" element={user?.role === 'vendor' ? <CustomerManagement /> : <Navigate to="/login" />} />
              <Route path="/vendor/delivery" element={user?.role === 'vendor' ? <DailyDelivery /> : <Navigate to="/login" />} />
              <Route path="/vendor/billing" element={user?.role === 'vendor' ? <Billing /> : <Navigate to="/login" />} />
              <Route path="/vendor/customers/:id" element={user?.role === 'vendor' ? <CustomerDetail /> : <Navigate to="/login" />} />
              <Route path="/vendor/reports" element={user?.role === 'vendor' ? <StaffReports /> : <Navigate to="/login" />} />
              <Route path="/vendor/staff" element={user?.role === 'vendor' && user?.subRole === 'owner' ? <StaffManagement /> : <Navigate to="/vendor" />} />

              {/* Customer Routes */}
              <Route path="/customer" element={user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
              <Route path="/customer/history" element={user?.role === 'customer' ? <History /> : <Navigate to="/login" />} />
              <Route path="/customer/profile" element={user?.role === 'customer' ? <Profile /> : <Navigate to="/login" />} />

              {/* Public Routes */}
              <Route path="/" element={user ? <Navigate to={user.role === 'vendor' ? '/vendor' : '/customer'} /> : <Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainLayout>
        </Router>
      </DataProvider>
    </UserContext.Provider>
  );
}

export default App;
