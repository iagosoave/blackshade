import React from 'react';
import { motion } from 'framer-motion';
import BackgroundImage from './background.avif';

export default function DirectorsList({ directors, onSelectDirector }) {
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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Camada de fundo com a tag <img> otimizada */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={BackgroundImage}
          alt="Imagem de fundo de diretores de cinema"
          className="w-full h-full object-cover"
          loading="eager" // Indica para o navegador carregar a imagem imediatamente
        />
        {/* Overlay semi-transparente sobre a imagem de fundo */}
        <div className="absolute inset-0 w-full h-full bg-black" style={{ opacity: 0.75 }}></div>
      </div>

      {/* Conteúdo dos diretores - Container centralizado */}
      <motion.div
        className="relative z-20 flex items-center justify-center w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col items-start text-left" style={{ paddingLeft: '0', paddingRight: '0' }}>
          {directors.map((director) => (
            <motion.div
              key={director.id}
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
                onClick={() => onSelectDirector(director)}
              >
                {director.name.toLowerCase()}
              </h2>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}