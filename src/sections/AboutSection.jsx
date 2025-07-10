import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function AboutSection({ language }) {
  const t = translations[language] || translations.pt;

  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-white text-xl opacity-60">{t.about.soon}</div>
      </div>
    </div>
  );
}