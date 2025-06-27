import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function ContactSection({ language }) {
  const t = translations[language] || translations.pt;
  const contactData = t.contact;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-white text-5xl md:text-7xl mb-12"
            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
          {contactData.title}
        </h2>
        
        <div className="text-white text-lg leading-relaxed space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">{contactData.fields.email}</p>
            <a href={`mailto:${contactData.info.email}`} className="text-xl hover:opacity-70 transition-opacity">
              {contactData.info.email}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">{contactData.fields.phone}</p>
            <a href={`tel:${contactData.info.phone}`} className="text-xl hover:opacity-70 transition-opacity">
              {contactData.info.phone}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">{contactData.fields.whatsapp}</p>
            <a 
              href={`https://wa.me/${contactData.info.whatsapp.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl hover:opacity-70 transition-opacity"
            >
              {contactData.info.whatsapp}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">{contactData.fields.instagram}</p>
            <a 
              href={`https://instagram.com/${contactData.info.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:opacity-70 transition-opacity"
            >
              {contactData.info.instagram}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">{contactData.fields.address}</p>
            <p className="text-xl">{contactData.info.address}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}