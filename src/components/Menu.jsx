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
      className="fixed bottom-0 left-0 right-0 z-50 pb-4 bg-black/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      {/* Linha divisória acima do menu - agora totalmente visível */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/100"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />
      
      {/* Container do menu - scroll horizontal em mobile */}
      <div className="pt-4 overflow-x-auto">
        <div className="flex items-center justify-start md:justify-end md:pr-6 min-w-max px-4 md:px-0">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.key}>
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <button
                  className="text-white text-[10px] sm:text-xs md:text-sm tracking-wider md:tracking-widest hover:opacity-70 transition-opacity whitespace-nowrap px-1 sm:px-2"
                  style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
                  onClick={() => onItemClick(item.label)}
                >
                  {item.label}
                </button>
                
                {/* Indicador de item ativo */}
                {activeModal === item.key && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white"
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
                  className="text-gray-500 mx-1 sm:mx-2 text-[10px] sm:text-xs md:text-sm"
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
      </div>
    </motion.nav>
  );
}