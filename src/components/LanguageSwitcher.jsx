import React from 'react';
import { motion } from 'framer-motion';

export default function LanguageSwitcher({ language, onChange }) {
  return (
    <motion.div
      className="fixed top-6 right-6 z-50 flex items-center gap-3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <button
        className={`text-sm tracking-wider transition-colors ${language === 'pt' ? 'text-white' : 'text-gray-500'}`}
        onClick={() => onChange('pt')}
      >
        PT
      </button>
      <div className="w-1 h-1 rounded-full bg-gray-500"></div>
      <button
        className={`text-sm tracking-wider transition-colors ${language === 'en' ? 'text-white' : 'text-gray-500'}`}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </motion.div>
  );
}