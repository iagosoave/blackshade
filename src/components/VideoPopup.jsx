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

  // URL with controls=1 to show progress bar and pause button
  // Changed autoplay=1 to autoplay=0 to make the video start paused
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=0&loop=0&byline=0&portrait=0&title=0&transparent=0&controls=1`;

  return (
    <AnimatePresence>
      {videoUrl && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 sm:p-0" // Added flex for centering, and padding for mobile
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Botão X */}
          <motion.button
            className="absolute top-4 right-4 text-white z-[110] p-2 sm:top-6 sm:right-6" // Adjusted button position for mobile
            onClick={onClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={28} strokeWidth={1} />
          </motion.button>
          
          {/* Video in fullscreen */}
          <div className="relative w-full max-w-4xl aspect-video"> {/* Added max-w-4xl and aspect-video for better scaling */}
            <iframe
              src={vimeoEmbedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              className="absolute inset-0 w-full h-full"
              title="Video Player"
              style={{
                // Removed explicit width and height to rely on parent's aspect-ratio and full sizing
                objectFit: 'contain' // Changed to 'contain' to ensure the whole video is visible within its aspect ratio
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}