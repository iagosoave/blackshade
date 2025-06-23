import React from 'react';
import { motion } from 'framer-motion';
import logo from './logo.png';

export default function Logo({ onClick }) {
  return (
    <motion.div
      className="fixed top-6 left-6 z-50 cursor-pointer"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={onClick}
    >
      <img 
        src={logo}
        alt="BLACKSHADE" 
        className="h-12"
      />
    </motion.div>
  );
}
