import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Play } from 'lucide-react';
import { translations } from '../config/translations';

export default function VideoPopup({ videoUrl, onClose, language = 'pt' }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const t = translations[language] || translations.pt;
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Previne scroll quando o popup está aberto
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!videoUrl) {
    return null;
  }

  const getVimeoId = (url) => {
    const regex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/\d+\/video\/|video\/|)(\d+)(?:[.+]*)?)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const vimeoId = getVimeoId(videoUrl);

  if (!vimeoId) {
    console.error("VideoPopup: URL do Vimeo inválida ou ID não encontrado:", videoUrl);
    return null;
  }

  // URL sem autoplay para começar pausado
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=0&loop=0&byline=0&portrait=0&title=0&transparent=0&controls=1&playsinline=1&muted=0`;

  const handleFullscreen = () => {
    const iframe = document.querySelector('#vimeo-player');
    if (iframe) {
      // Para dispositivos móveis, força orientação landscape se possível
      if (isMobile && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
          // Se não conseguir travar a orientação, continua mesmo assim
        });
      }
      
      // Tenta fullscreen no iframe
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  return (
    <AnimatePresence>
      {videoUrl && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header com botões */}
          <div className="absolute top-0 left-0 right-0 z-[110] flex justify-between items-center p-4 md:p-6">
            {/* Botão Fullscreen (mobile) */}
            {isMobile && (
              <motion.button
                className="text-white p-2 bg-black/50 rounded-lg backdrop-blur-sm"
                onClick={handleFullscreen}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.9 }}
              >
                <Maximize2 size={24} strokeWidth={1.5} />
              </motion.button>
            )}
            
            {/* Espaçador invisível para manter o X à direita quando não há botão fullscreen */}
            {!isMobile && <div />}
            
            {/* Botão Fechar */}
            <motion.button
              className="text-white p-2 bg-black/50 rounded-lg backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} strokeWidth={1.5} />
            </motion.button>
          </div>
          
          {/* Container do vídeo */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Overlay com instruções no mobile */}
            {isMobile && !isPlaying && (
              <motion.div 
                className="absolute inset-0 z-[105] flex flex-col items-center justify-center bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPlaying(true)}
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4"
                  whileTap={{ scale: 0.9 }}
                >
                  <Play size={48} className="text-white" fill="white" />
                </motion.div>
                <p className="text-white text-sm opacity-70 text-center px-8">
                  {t.video.playButton} • {t.video.rotateHint}
                </p>
              </motion.div>
            )}
            
            {/* Iframe do Vimeo */}
            <iframe
              id="vimeo-player"
              src={vimeoEmbedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; gyroscope; accelerometer"
              allowFullScreen
              className={`w-full h-full ${isMobile ? 'max-h-[80vh]' : ''}`}
              title="Video Player"
              style={{
                width: '100%',
                height: isMobile ? 'auto' : '100%',
                aspectRatio: '16/9',
                maxWidth: '100vw',
                maxHeight: isMobile ? '80vh' : '100vh',
              }}
              onLoad={() => {
                // Se estiver em mobile e o usuário já clicou em play, inicia o vídeo
                if (isMobile && isPlaying) {
                  const iframe = document.querySelector('#vimeo-player');
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage('{"method":"play"}', '*');
                  }
                }
              }}
            />
          </div>
          
          {/* Dica de orientação no mobile */}
          {isMobile && (
            <motion.div 
              className="absolute bottom-4 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white text-xs opacity-50 px-4">
                {t.video.betterExperience}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}