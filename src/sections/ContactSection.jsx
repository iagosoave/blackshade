import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import backgroundVideo from '../video.mp4';
import { FaInstagram, FaVimeoV } from 'react-icons/fa';

export default function ContactSection({ language }) {
  const videoRef = useRef(null);

  // Efeito para garantir o autoplay do vídeo de fundo
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.muted = true;
      videoElement.playsInline = true;

      const playVideo = () => {
        videoElement.play().catch(err => {
          console.warn('Erro ao tentar reproduzir o vídeo automaticamente:', err);
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
      {/* Vídeo de Background com Opacidade */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          controls={false}
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          style={{ pointerEvents: 'none' }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      {/* Conteúdo do Contato */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-8">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white space-y-6 md:space-y-8">
            
            {/* Email Geral */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                Email
              </p>
              <a 
                href="mailto:contato@blackshade.com.br" 
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-block whitespace-nowrap"
              >
                contato@blackshade.com.br
              </a>
            </motion.div>

            {/* Produção Executiva - Gus Vargas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                Produção Executiva - Gus Vargas
              </p>
              <a 
                href="https://wa.me/5511942376027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-block whitespace-nowrap"
              >
                +55 11 94237.6027
              </a>
              <a 
                href="mailto:gustavo@blackshade.com.br" 
                className="text-sm opacity-80 mt-1 hover:opacity-100 transition-opacity block whitespace-nowrap"
              >
                gustavo@blackshade.com.br
              </a>
            </motion.div>
            
            {/* Atendimento - Rodrigo Sivieri */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                Atendimento - Rodrigo Sivieri
              </p>
              <a 
                href="https://wa.me/5511988185462"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-block whitespace-nowrap"
              >
                +55 11 98818.5462
              </a>
              <a 
                href="mailto:rodrigo@blackshade.com.br" 
                className="text-sm opacity-80 mt-1 hover:opacity-100 transition-opacity block whitespace-nowrap"
              >
                rodrigo@blackshade.com.br
              </a>
            </motion.div>
            
            {/* Redes Sociais */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-3 whitespace-nowrap">
                Redes Sociais
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/blackshadefilms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Instagram"
                >
                  <FaInstagram size={32} />
                </a>
                <a 
                  href="https://vimeo.com/blackshadefilms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Vimeo"
                >
                  <FaVimeoV size={32} />
                </a>
              </div>
            </motion.div>
            
            {/* Endereço */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                Endereço
              </p>
              <p className="text-base md:text-lg whitespace-nowrap">
                São Paulo // Rio de Janeiro
              </p>
            </motion.div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}