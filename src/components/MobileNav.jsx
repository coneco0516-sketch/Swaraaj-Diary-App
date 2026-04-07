import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, ReceiptText, Users, Settings } from 'lucide-react';

const MobileNav = ({ role }) => {
  const vendorLinks = [
    { to: '/vendor', icon: <LayoutDashboard size={22} />, label: 'Home' },
    { to: '/vendor/delivery', icon: <Truck size={22} />, label: 'Delivery' },
    { to: '/vendor/billing', icon: <ReceiptText size={22} />, label: 'Billing' },
    { to: '/vendor/customers', icon: <Users size={22} />, label: 'Users' }
  ];

  const customerLinks = [
    { to: '/customer', icon: <LayoutDashboard size={22} />, label: 'Home' },
    { to: '/customer/history', icon: <ReceiptText size={22} />, label: 'History' },
    { to: '/customer/profile', icon: <Settings size={22} />, label: 'Settings' }
  ];

  const links = role === 'vendor' ? vendorLinks : customerLinks;

  return (
    <nav className="tab-bar">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
        >
          <div className="tab-icon">{link.icon}</div>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
