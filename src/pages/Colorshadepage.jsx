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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const paragraphs = [
    "A Color Shade é o espaço da Black Shade voltado para criações autorais. É onde a gente se permite experimentar, testar novas narrativas e composições visuais sem a pressão de seguir fórmulas prontas.",
    "Cada projeto nasce da liberdade de transformar inquietações em imagens que convidam à reflexão e ampliam o olhar sobre o audiovisual.",
    "As cores ou a ausência delas e suas nuances são parte desse processo, cada camada abre uma possibilidade de revelar algo que ainda não foi percebido.",
    "Mais do que produzir, buscamos construir narrativas que tenham densidade e que desafiem o óbvio, tratando o cinema e o audiovisual como linguagens vivas, sempre abertas a novas interpretações."
  ];

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
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/50" />
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
        
        {/* Conteúdo - mesmo layout do AboutSection */}
        <div className="relative z-10 min-h-screen md:h-screen flex items-center justify-center px-6 py-20 md:px-16 md:py-8 lg:px-24 xl:px-32">
          <div className="max-w-4xl w-full">
            <div className="space-y-5">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="text-white text-sm md:text-base leading-relaxed font-light tracking-wide"
                  style={{ textAlign: 'justify' }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}