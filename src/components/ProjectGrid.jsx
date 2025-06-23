import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectGrid({ items, onSelectItem }) {
  return (
    <div>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden cursor-pointer group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectItem(item)}
          >
            <div className="absolute inset-0">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-white text-2xl md:text-3xl tracking-wider"
                  style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2 opacity-80">{item.description}</p>
              {item.artist && (
                <p className="text-gray-400 text-xs mt-1 opacity-70">{item.artist}</p>
              )}
              {item.technologies && (
                <p className="text-gray-400 text-xs mt-1 opacity-70">{item.technologies}</p>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-white text-xl opacity-60">Em breve</div>
        </div>
      )}
    </div>
  );
}