import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectGrid({ items, onSelectItem }) {
  // Se 'items' não for um array ou estiver vazio, mostra a mensagem "Em breve".
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white text-xl opacity-60">Em breve</div>
      </div>
    );
  }

  return (
    // Usa CSS Grid para criar o layout com 2 colunas em desktop e 1 em mobile.
    <div className="grid grid-cols-1 md:grid-cols-2">
      {items.map((item, index) => (
        <motion.div
          key={item.id || index} // Usa o index como fallback para a key
          className="relative h-[50vh] cursor-pointer group overflow-hidden"
          onClick={() => onSelectItem(item)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {/* Imagem de Fundo */}
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay Escuro para Legibilidade */}
          <div className="absolute inset-0 bg-black/60" />

          {/* === A ÚNICA COISA VISÍVEL SOBRE A IMAGEM === */}
          {/* Este container usa flexbox para centralizar o título */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h3 
              className="text-white text-5xl text-center"
              style={{ 
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif',
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
              }}
            >
              {/* Garante que o título seja exibido */}
              {item.title}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
