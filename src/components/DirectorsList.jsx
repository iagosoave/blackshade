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

  // Função para dividir diretores em colunas
  const splitIntoColumns = (directors, numColumns) => {
    const columns = Array.from({ length: numColumns }, () => []);
    directors.forEach((director, index) => {
      columns[index % numColumns].push(director);
    });
    return columns;
  };

  const columns = splitIntoColumns(directors, 2); // 2 colunas no desktop

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
        className="w-full max-w-6xl relative z-20 overflow-y-auto p-4 pb-20"
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

        {/* Layout Mobile - Lista vertical */}
        <div className="block md:hidden">
          {directors.map((director, index) => (
            <motion.div
              key={director.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <h2
                className="text-white text-4xl mb-4 cursor-pointer hover:translate-x-4 transition-transform leading-tight"
                style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
                onClick={() => onSelectDirector(director)}
              >
                {director.name}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Layout Desktop - Grid de 2 colunas */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-16 md:items-start">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col space-y-8">
              {column.map((director, index) => (
                <motion.div
                  key={director.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: (columnIndex * 0.1) + (index * 0.15), 
                    duration: 0.6 
                  }}
                >
                  <h2
                    className="text-white text-3xl lg:text-4xl xl:text-5xl cursor-pointer hover:scale-105 transition-transform leading-tight text-center"
                    style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
                    onClick={() => onSelectDirector(director)}
                  >
                    {director.name}
                  </h2>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}