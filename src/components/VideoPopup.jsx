import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function VideoPopup({ videoUrl, onClose }) {
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

  // URL com controls=1 para mostrar barra de progresso e botão de pause
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=0&byline=0&portrait=0&title=0&transparent=0&controls=1`;

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
          {/* Botão X */}
          <motion.button
            className="absolute top-6 right-6 text-white z-[110] p-2"
            onClick={onClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={28} strokeWidth={1} />
          </motion.button>
          
          {/* Video em fullscreen */}
          <div className="relative w-full h-full">
            <iframe
              src={vimeoEmbedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              className="absolute inset-0 w-full h-full"
              title="Video Player"
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}