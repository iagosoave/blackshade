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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-full w-full relative flex flex-col items-center justify-start text-white">
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

      {/* Conteúdo dos diretores - z-index alto para ficar acima do background */}
      {/* Adicionado padding-top para evitar sobreposição com o logo e padding-bottom para a "linha" */}
      {/* Conteúdo é centralizado horizontalmente, mas alinhado ao topo verticalmente */}
      <motion.div
        className="w-full max-w-4xl relative z-20 flex flex-col items-center py-20 px-4 md:px-8" // py-20 para padding vertical (topo e base), px-4/8 para lateral
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        // Removido overflow-y-auto e maxHeight aqui, pois o Modal já gerencia a rolagem
      >
        {directors.map((director, index) => (
          <motion.div
            key={director.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="w-full text-center" // Garante que cada nome ocupe a largura total disponível e seja centralizado
          >
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 md:mb-12 cursor-pointer hover:translate-x-4 transition-transform leading-none" // Ajuste de tamanhos de texto responsivos
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