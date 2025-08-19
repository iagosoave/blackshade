import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaVimeoV, FaWhatsapp } from 'react-icons/fa';
import { translations } from '../config/translations';
import BackgroundVideo from '../components/BackgroundVideo';

// Lazy loading do vídeo
const loadVideo = () => import('../02.mp4');

export default function ContactSection({ language }) {
  const t = translations[language] || translations.pt;
  const contactData = t.contact;
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  // Carregar o vídeo de forma assíncrona
  useEffect(() => {
    loadVideo().then((module) => {
      setVideoSrc(module.default);
      // Pré-carregar o vídeo no navegador
      const video = document.createElement('video');
      video.src = module.default;
      video.onloadeddata = () => {
        setVideoReady(true);
      };
      video.load();
    });
  }, []);

  // Memoizar o componente de vídeo para evitar re-renderizações
  const videoComponent = useMemo(() => {
    if (!videoSrc) return null;
    
    return (
      <div className={`transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}>
        <BackgroundVideo 
          videos={[videoSrc]} 
          opacity={0.3} 
          loop={true}
          // Adicionar propriedades para melhor performance
          muted={true}
          playsInline={true}
          preload="metadata" // Carregar apenas metadados inicialmente
        />
      </div>
    );
  }, [videoSrc, videoReady]);

  return (
    <div className="min-h-screen relative">
      {/* Fallback de fundo enquanto o vídeo carrega */}
      {!videoReady && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60" />
      )}
      
      {/* Renderizar o vídeo quando estiver pronto */}
      {videoComponent}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-8">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1">
                {contactData.fields.email}
              </p>
              <a
                href={`mailto:${contactData.info.email}`}
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-block"
              >
                {contactData.info.email}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1">
                {contactData.fields.executiveProduction} - {contactData.info.gusVargas.nome}
              </p>
              <a
                href={`https://wa.me/${contactData.info.gusVargas.cel.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-flex items-center justify-center space-x-2"
              >
                <FaWhatsapp className="text-xl" />
                <span>{contactData.info.gusVargas.cel}</span>
              </a>
              <a
                href={`mailto:${contactData.info.gusVargas.email}`}
                className="text-sm opacity-80 mt-1 hover:opacity-100 transition-opacity block"
              >
                {contactData.info.gusVargas.email}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1">
                {contactData.fields.service} - {contactData.info.rodrigoSivieri.nome}
              </p>
              <a
                href={`https://wa.me/${contactData.info.rodrigoSivieri.cel.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-flex items-center justify-center space-x-2"
              >
                <FaWhatsapp className="text-xl" />
                <span>{contactData.info.rodrigoSivieri.cel}</span>
              </a>
              <a
                href={`mailto:${contactData.info.rodrigoSivieri.email}`}
                className="text-sm opacity-80 mt-1 hover:opacity-100 transition-opacity block"
              >
                {contactData.info.rodrigoSivieri.email}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-3">
                {contactData.fields.socialMedia}
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href={contactData.info.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Instagram"
                >
                  <FaInstagram size={32} />
                </a>
                <a
                  href={contactData.info.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Vimeo"
                >
                  <FaVimeoV size={32} />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1">
                {contactData.fields.address}
              </p>
              <p className="text-base md:text-lg">
                {contactData.info.address}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
