import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function CosmosSection({ language }) {
  const t = translations[language] || translations.pt;

  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-white text-xl opacity-60">{t.cosmos.soon}</div>
      </div>
    </div>
  );
}