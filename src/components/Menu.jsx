import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function Menu({ onItemClick, language }) {
  const t = translations[language] || translations.pt;
  const menuItems = [t.menu.directors, t.menu.music, t.menu.ai, t.menu.contact];

  return (
    <motion.nav
      className="fixed bottom-6 right-6 z-50 flex items-center gap-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      {menuItems.map((item, index) => (
        <motion.button
          key={item}
          className="text-white text-sm tracking-widest hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          whileHover={{ y: -2 }}
          onClick={() => onItemClick(item)}
        >
          {item}
        </motion.button>
      ))}
    </motion.nav>
  );
}