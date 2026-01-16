import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

export default function Logo() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/');
  };

  return (
    <motion.div
      className="fixed top-4 left-6 md:top-5 md:left-10 z-50 cursor-pointer"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={handleClick}
    >
      <img 
        src={logo}
        alt="BLACKSHADE" 
        className="h-10 md:h-16"
      />
    </motion.div>
  );
}