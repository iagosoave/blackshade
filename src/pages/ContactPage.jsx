import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactSection from '../sections/ContactSection';

export default function ContactPage({ language }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      <motion.div
        className="relative w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {/* Botão de voltar - Seta grande e clara no mobile, X no desktop */}
        <motion.button
          className="fixed top-4 right-4 md:top-6 md:right-6 text-white z-50 p-3 md:p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={handleClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Seta para mobile */}
          <svg 
            className="block md:hidden" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {/* X para desktop */}
          <svg 
            className="hidden md:block" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
        
        <div className="w-full h-full overflow-y-auto">
          <ContactSection language={language} />
        </div>
      </motion.div>
    </motion.div>
  );
}