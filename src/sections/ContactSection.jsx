import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function ContactSection({ language }) {
  const t = translations[language] || translations.pt;
  const contactData = t.contact;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 sm:mb-10 md:mb-12 break-words"
            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
          {contactData.title}
        </h2>
        
        <div className="text-white text-base sm:text-lg leading-relaxed space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-b border-white/10 pb-4 sm:pb-6"
          >
            <p className="opacity-60 text-xs sm:text-sm uppercase tracking-wider mb-2">
              {contactData.fields.email}
            </p>
            <a 
              href={`mailto:${contactData.info.email}`} 
              className="text-lg sm:text-xl hover:opacity-70 transition-opacity block break-all"
            >
              {contactData.info.email}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border-b border-white/10 pb-4 sm:pb-6"
          >
            <p className="opacity-60 text-xs sm:text-sm uppercase tracking-wider mb-2">
              {contactData.fields.phone}
            </p>
            <a 
              href={`tel:${contactData.info.phone}`} 
              className="text-lg sm:text-xl hover:opacity-70 transition-opacity block"
            >
              {contactData.info.phone}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="border-b border-white/10 pb-4 sm:pb-6"
          >
            <p className="opacity-60 text-xs sm:text-sm uppercase tracking-wider mb-2">
              {contactData.fields.whatsapp}
            </p>
            <a 
              href={`https://wa.me/${contactData.info.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl hover:opacity-70 transition-opacity inline-flex items-center gap-2"
            >
              <span>{contactData.info.whatsapp}</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="border-b border-white/10 pb-4 sm:pb-6"
          >
            <p className="opacity-60 text-xs sm:text-sm uppercase tracking-wider mb-2">
              {contactData.fields.instagram}
            </p>
            <a 
              href={`https://instagram.com/${contactData.info.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl hover:opacity-70 transition-opacity inline-flex items-center gap-2"
            >
              <span>{contactData.info.instagram}</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="opacity-60 text-xs sm:text-sm uppercase tracking-wider mb-2">
              {contactData.fields.address}
            </p>
            <p className="text-lg sm:text-xl leading-relaxed">
              {contactData.info.address}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}