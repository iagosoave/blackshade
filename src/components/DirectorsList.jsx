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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative"> {/* Adicionado p-4 para mobile */}
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
        <div className="absolute inset-0 w-full h-full bg-black" style={{ opacity: 0.7 }}></div> {/* Opacidade do fundo (0.0 a 1.0) */}
      </div>

      {/* Conteúdo dos diretores - Garante que o texto fique acima do fundo e não herde a opacidade */}
      {/* Este contêiner agora tem scroll próprio (mas a barra está oculta) e um limite de altura */}
      <motion.div
        className="w-full max-w-4xl relative z-20 overflow-y-auto p-4 pb-20" // p-4 para padding lateral, pb-20 para padding inferior
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          maxHeight: 'calc(100vh - 120px)',
          /* Estilos para ocultar a barra de rolagem, mas manter o scroll */
          scrollbarWidth: 'none', /* Firefox */
          WebkitOverflowScrolling: 'touch', /* Para rolagem suave no iOS */
        }}
      >
        {/* Estilos para ocultar a barra de rolagem no Chrome, Safari e Edge */}
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
              className="text-white text-6xl md:text-8xl mb-8 md:mb-12 cursor-pointer hover:translate-x-4 transition-transform leading-none"
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