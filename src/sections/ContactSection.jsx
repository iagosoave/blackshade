import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaVimeoV, FaWhatsapp } from 'react-icons/fa';
import { translations } from '../config/translations';
import backgroundVideo from '../03.mp4';

export default function ContactSection({ language }) {
  const videoRef = useRef(null);
  const t = translations[language] || translations.pt;
  const contactData = t.contact;

  // Efeito para garantir o autoplay do vídeo de fundo dentro do ContactSection
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.muted = true;
      videoElement.playsInline = true;

      const playVideo = () => {
        videoElement.play().catch(err => {
          console.warn('Erro ao tentar reproduzir o vídeo automaticamente no ContactSection:', err);
          document.addEventListener('click', () => {
            videoElement.play().catch(e => console.error('Erro ao reproduzir vídeo após clique no ContactSection:', e));
          }, { once: true });
        });
      };

      if (videoElement.readyState >= 3) {
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo);
        return () => videoElement.removeEventListener('loadeddata', playVideo);
      }
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Vídeo de Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          controls={false}
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3, pointerEvents: 'none' }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>

      {/* Conteúdo do Contato */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-8">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white space-y-6 md:space-y-8">

            {/* Email */}
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

            {/* Executive Production - Gus Vargas */}
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

            {/* Service - Rodrigo Sivieri */}
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

            {/* Social Media */}
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

            {/* Address */}
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