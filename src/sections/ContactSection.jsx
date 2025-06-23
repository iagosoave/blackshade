import React from 'react';
import { motion } from 'framer-motion';

export default function ContactSection({ language }) {
  // Dados hardcoded
  const contactInfo = {
    pt: {
      title: 'CONTATO',
      email: 'contato@blackshadefilmes.com',
      phone: '+55 11 9999-9999',
      whatsapp: '+55 11 9999-9999',
      address: 'São Paulo, Brasil',
      instagram: '@blackshadefilmes'
    },
    en: {
      title: 'CONTACT',
      email: 'contact@blackshadefilmes.com',
      phone: '+55 11 9999-9999',
      whatsapp: '+55 11 9999-9999',
      address: 'São Paulo, Brazil',
      instagram: '@blackshadefilmes'
    }
  };

  const data = contactInfo[language];

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
          {data.title}
        </h2>
        
        <div className="text-white text-lg leading-relaxed space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">Email</p>
            <a href={`mailto:${data.email}`} className="text-xl hover:opacity-70 transition-opacity">
              {data.email}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">Telefone</p>
            <a href={`tel:${data.phone}`} className="text-xl hover:opacity-70 transition-opacity">
              {data.phone}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">WhatsApp</p>
            <a 
              href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl hover:opacity-70 transition-opacity"
            >
              {data.whatsapp}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">Instagram</p>
            <a 
              href={`https://instagram.com/${data.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:opacity-70 transition-opacity"
            >
              {data.instagram}
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="opacity-60 text-sm uppercase tracking-wider mb-2">Endereço</p>
            <p className="text-xl">{data.address}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}