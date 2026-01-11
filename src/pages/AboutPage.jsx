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
      {/* Container sem scroll */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Imagem de fundo fixa */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/imagens/back_about.webp)' }}
        >
          {/* Overlay escuro opcional para melhorar legibilidade */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Botão de fechar */}
        <motion.button
          className="fixed top-6 right-6 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={handleClose}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
        
        {/* Conteúdo fixo */}
        <div className="relative z-10">
          <AboutSection language={language} />
        </div>
      </div>
    </motion.div>
  );
}