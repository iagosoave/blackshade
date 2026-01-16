import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PhotographyPage({ language }) {
  const navigate = useNavigate();

  const photographers = [
    { id: 'juan-ribeiro', name: 'Juan Ribeiro' },
    { id: 'renata-massetti', name: 'Renata Massetti' }
  ];

  const handleClose = () => {
    navigate('/');
  };

  const handleSelectPhotographer = (photographer) => {
    navigate(`/fotografia/${photographer.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" />
      
      <motion.div
        className="relative w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {/* Botão de fechar - apenas no desktop - X para fechar e voltar à home */}
        <motion.button
          className="hidden md:block fixed top-6 right-6 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={handleClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
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

        {/* Botão de voltar no mobile - Seta para voltar à home */}
        <motion.button
          className="block md:hidden fixed top-4 right-4 text-white z-50 p-3 hover:bg-white/10 rounded-full transition-colors"
          onClick={handleClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
        
        {/* Lista de Fotógrafos */}
        <div className="min-h-screen flex items-center justify-center relative">
          {/* Camada de fundo com a tag <img> otimizada */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/imagens/background.webp"
              alt="Imagem de fundo de fotógrafos"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 w-full h-full bg-black" style={{ opacity: 0.75 }}></div>
          </div>

          {/* Conteúdo dos fotógrafos - Container centralizado */}
          <motion.div
            className="relative z-20 flex items-center justify-center w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex flex-col items-start text-left" style={{ paddingLeft: '0', paddingRight: '0' }}>
              {photographers.map((photographer) => (
                <motion.div
                  key={photographer.id}
                  variants={itemVariants}
                  className="leading-none"
                >
                  <h2
                    className="text-white cursor-pointer hover:scale-105 transition-all duration-300"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '700',
                      fontSize: 'clamp(2.5rem, 5.6vw, 5.5rem)',
                      lineHeight: '0.9',
                      letterSpacing: '-0.03em',
                      marginBottom: '0.15em'
                    }}
                    onClick={() => handleSelectPhotographer(photographer)}
                  >
                    {photographer.name.toLowerCase()}
                  </h2>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}