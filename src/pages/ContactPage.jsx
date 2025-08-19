import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactSection from '../sections/ContactSection';

export default function ContactPage({ language }) {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Pré-carregar o vídeo quando o componente montar
  useEffect(() => {
    // Importar o vídeo dinamicamente para melhor performance
    import('../02.mp4').then(() => {
      setVideoLoaded(true);
    });
  }, []);

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
        <motion.button
          className="absolute top-6 right-6 text-white z-50 p-2"
          onClick={handleClose}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
        
        <div className="w-full h-full overflow-y-auto">
          {/* Mostrar um placeholder enquanto o vídeo carrega */}
          {!videoLoaded && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="opacity-60">Carregando...</p>
              </div>
            </div>
          )}
          
          {/* Renderizar o ContactSection apenas quando o vídeo estiver pronto */}
          {videoLoaded && <ContactSection language={language} />}
        </div>
      </motion.div>
    </motion.div>
  );
}