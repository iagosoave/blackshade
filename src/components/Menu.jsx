import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from '../config/translations';

export default function Menu({ language, activeModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language] || translations.pt;

  const menuItems = [
    { label: t.menu.about, key: 'about', path: '/sobre' },
    { label: t.menu.directors, key: 'directors', path: '/diretores' },
    { label: t.menu.colorshade, key: 'colorshade', path: '/colorshade' },
    { label: t.menu.photography, key: 'photography', path: '/fotografia' },
    { label: t.menu.contact, key: 'contact', path: '/contato' }
  ];

  const handleItemClick = (item) => {
    navigate(item.path);
    setIsOpen(false);
  };

  // Verifica se está na home page
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Botão Menu Hambúrguer - APENAS NA HOME */}
      {isHomePage && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 w-12 h-12 flex flex-col justify-center items-center gap-1.5 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="w-6 h-[1px] bg-white block"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 6 : 0
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-6 h-[1px] bg-white block"
            animate={{
              opacity: isOpen ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-6 h-[1px] bg-white block"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -6 : 0
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}

      {/* Menu Mobile - Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full flex flex-col justify-center items-center space-y-8">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  className={`text-white text-2xl tracking-wider relative lowercase ${
                    activeModal === item.key ? 'opacity-100' : 'opacity-70'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  {activeModal === item.key && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Desktop - Original */}
      <motion.nav
        className="fixed bottom-6 left-0 right-0 z-50 hidden md:block"
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
                  className="text-white text-sm tracking-wider hover:opacity-70 transition-opacity pb-1 lowercase"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}
                  onClick={() => handleItemClick(item)}
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
    </>
  );
}