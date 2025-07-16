import React from 'react';
import { motion } from 'framer-motion';
import BackgroundImage from './background.png'; // Importe a imagem de fundo

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
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative">
      {/* Camada de fundo com imagem */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay semi-transparente sobre a imagem de fundo */}
        <div className="absolute inset-0 w-full h-full bg-black" style={{ opacity: 0.7 }}></div>
      </div>

      {/* Conteúdo dos diretores */}
      <motion.div
        className="w-full max-w-4xl relative z-20 overflow-y-auto p-4 pb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          maxHeight: 'calc(100vh - 120px)',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>
          {`
            ::-webkit-scrollbar {
              width: 0px;
            }
          `}
        </style>
        {directors.map((director, index) => (
          <motion.div
            key={director.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
          >
            <h2
              // AQUI ESTÃO AS MUDANÇAS:
              // text-4xl para mobile (telas pequenas)
              // md:text-8xl para desktop (telas médias e maiores)
              // mb-4 para mobile (margem inferior)
              // md:mb-12 para desktop (margem inferior)
              className="text-white text-4xl md:text-8xl mb-4 md:mb-12 cursor-pointer hover:translate-x-4 transition-transform leading-tight" // leading-tight para ajuste de linha
              style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
              onClick={() => onSelectDirector(director)}
            >
              {director.name}
            </h2>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}