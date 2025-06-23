import React from 'react';
import { motion } from 'framer-motion';

export default function DirectorsList({ directors, onSelectDirector }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {directors.map((director, index) => (
          <motion.div
            key={director.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
          >
            <h2
              className="text-white text-6xl md:text-8xl mb-12 cursor-pointer hover:translate-x-4 transition-transform"
              style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
              onClick={() => onSelectDirector(director)}
            >
              {director.name}
            </h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}