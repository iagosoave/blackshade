import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, children, direction = 'left' }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full h-full overflow-hidden"
            initial={{ x: direction === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction === 'left' ? '-100%' : '100%' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.button
              className="absolute top-4 right-4 text-white z-50 p-2 sm:top-6 sm:right-6" // top-4/right-4 para mobile
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} strokeWidth={1} />
            </motion.button>

            {/* Este div gerencia o scroll do conteúdo do modal */}
            {/* Adicionado padding geral (p-6) para o conteúdo dentro do modal */}
            <div className="w-full h-full overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}