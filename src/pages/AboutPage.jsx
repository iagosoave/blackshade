import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AboutSection from '../sections/AboutSection';

export default function AboutPage({ language }) {
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
      {/* Container COM scroll para mobile */}
      <div className="relative w-full h-full overflow-y-auto md:overflow-hidden">
        {/* Imagem de fundo fixa */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/imagens/back_about.webp)' }}
        >
          {/* Overlay escuro opcional para melhorar legibilidade */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
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
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
        
        {/* Conteúdo com padding superior no mobile para não ficar atrás do logo */}
        <div className="relative z-10 pt-20 md:pt-0">
          <AboutSection language={language} />
        </div>
      </div>
    </motion.div>
  );
}