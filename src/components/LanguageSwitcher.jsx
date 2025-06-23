import React from 'react';
import { motion } from 'framer-motion';

export default function LanguageSwitcher({ language, onChange }) {
  return (
    <motion.div
      className="fixed top-6 right-6 z-50 flex items-center gap-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <button
        className={`text-sm tracking-wider ${language === 'pt' ? 'text-white' : 'text-gray-500'}`}
        onClick={() => onChange('pt')}
      >
        PT
      </button>
      <span className="text-gray-500">//</span>
      <button
        className={`text-sm tracking-wider ${language === 'en' ? 'text-white' : 'text-gray-500'}`}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </motion.div>
  );
}