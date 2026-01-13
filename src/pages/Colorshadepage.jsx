import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { translations } from '../config/translations';

export default function ColorShadePage({ language }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.pt;

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
      {/* Imagem de fundo - mesma do about */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/imagens/back_about.webp"
          alt="Imagem de fundo"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <motion.div
        className="relative w-full h-full overflow-auto"
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
        
        <div className="w-full min-h-full flex items-center justify-center px-6 py-20">
          <motion.div
            className="max-w-3xl text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-white text-base md:text-lg leading-relaxed mb-6">
              A Color Shade é o espaço da Black Shade voltado para criações autorais.
              É onde a gente se permite experimentar, testar novas narrativas e composições visuais sem a pressão de seguir fórmulas prontas.
            </p>
            
            <p className="text-white text-base md:text-lg leading-relaxed mb-6">
              Cada projeto nasce da liberdade de transformar inquietações em imagens que convidam à reflexão e ampliam o olhar sobre o audiovisual.
            </p>
            
            <p className="text-white text-base md:text-lg leading-relaxed mb-6">
              As cores ou a ausência delas e suas nuances são parte desse processo, cada camada abre uma possibilidade de revelar algo que ainda não foi percebido.
            </p>
            
            <p className="text-white text-base md:text-lg leading-relaxed">
              Mais do que produzir, buscamos construir narrativas que tenham densidade e que desafiem o óbvio, tratando o cinema e o audiovisual como linguagens vivas, sempre abertas a novas interpretações.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}