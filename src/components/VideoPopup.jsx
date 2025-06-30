import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function VideoPopup({ videoUrl, onClose }) {
  useEffect(() => {
    // Previne scroll quando aberto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!videoUrl) return null;

  // Extrai ID do Vimeo
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  const vimeoId = vimeoMatch ? vimeoMatch[1] : null;

  if (!vimeoId) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-8">
        <div className="text-white text-center">
          <p className="mb-4">Erro: URL do vídeo inválida</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/20 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  // URL do embed SEM autoplay (começa pausado)
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=0&playsinline=1`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] bg-black/50 text-white p-3 rounded-full"
        >
          <X size={24} />
        </button>
        
        {/* Container do vídeo */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo video"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}