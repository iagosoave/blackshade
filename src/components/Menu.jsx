import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function Menu({ onItemClick, language, activeModal }) {
  const t = translations[language] || translations.pt;
  
  // Nova ordem dos itens do menu com suas chaves correspondentes
  const menuItems = [
    { label: t.menu.about, key: 'about' },
    { label: t.menu.directors, key: 'directors' },
    { label: t.menu.cosmos, key: 'cosmos' },
    { label: t.menu.daydream, key: 'daydream' },
    { label: t.menu.contact, key: 'contact' }
  ];

  return (
    <motion.nav
      className="fixed bottom-6 left-0 right-0 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      {/* Linha divisória acima do menu */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 h-[1px] bg-white/100"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />
      
      {/* Container do menu */}
      <div className="flex items-center gap-2 justify-end pr-6">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.key}>
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <button
                className="text-white text-sm tracking-widest hover:opacity-70 transition-opacity pb-1"
                style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
                onClick={() => onItemClick(item.label)}
              >
                {item.label}
              </button>
              
              {/* Indicador de item ativo */}
              {activeModal === item.key && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </motion.div>
            
            {/* Separador // */}
            {index < menuItems.length - 1 && (
              <motion.span 
                className="text-gray-500 mx-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                //
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.nav>
  );
}