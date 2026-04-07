import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import MobileNav from './MobileNav';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: user ? '80px' : '0px' }}>
      <AnimatePresence mode="wait">
        <motion.main
          key={window.location.pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {user && <MobileNav role={user.role} />}
    </div>
  );
};

export default MainLayout;
