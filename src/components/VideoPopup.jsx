import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

export default function VideoPopup({ videoUrl, onClose }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  
  useEffect(() => {
    // Detecta mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Previne scroll
    document.body.style.overflow = 'hidden';
    
    // Timeout para mostrar fallback se o iframe não carregar
    const fallbackTimer = setTimeout(() => {
      if (isMobile) {
        setShowFallback(true);
      }
    }, 3000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
      clearTimeout(fallbackTimer);
    };
  }, [isMobile]);

  if (!videoUrl) {
    return null;
  }

  // Extrai o ID do Vimeo
  const getVimeoId = (url) => {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
      /vimeo\.com\/video\/(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const vimeoId = getVimeoId(videoUrl);

  if (!vimeoId) {
    return (
      <motion.div
        className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-white text-center">
          <p className="mb-4">Erro: URL do vídeo inválida</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/20 rounded hover:bg-white/30"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    );
  }

  // Se for mobile e mostrar fallback, oferece opção de abrir externamente
  if (isMobile && showFallback) {
    return (
      <motion.div
        className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-white text-center max-w-sm">
          <p className="mb-6">O vídeo está com dificuldades para carregar no seu dispositivo.</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                window.open(videoUrl, '_blank');
                onClose();
              }}
              className="w-full px-6 py-3 bg-white text-black rounded flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Abrir no Vimeo
            </button>
            <button
              onClick={() => setShowFallback(false)}
              className="w-full px-6 py-2 bg-white/20 rounded"
            >
              Tentar novamente
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-2 text-white/60"
            >
              Cancelar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Player embed URL otimizada
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?` + 
    new URLSearchParams({
      autoplay: '1',
      playsinline: '1',
      controls: '1',
      title: '0',
      byline: '0',
      portrait: '0',
      responsive: '1'
    }).toString();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header com botões */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-[10000]">
          {/* Botão de abrir externamente (mobile) */}
          {isMobile && (
            <button
              onClick={() => {
                window.open(videoUrl, '_blank');
                onClose();
              }}
              className="bg-black/50 backdrop-blur text-white p-2 rounded-full"
              title="Abrir no Vimeo"
            >
              <ExternalLink size={20} />
            </button>
          )}
          
          {!isMobile && <div />}
          
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="bg-black/50 backdrop-blur text-white p-2 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Container do vídeo */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black">
            {/* Loading indicator */}
            {!showFallback && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/50">Carregando vídeo...</div>
              </div>
            )}
            
            {/* Iframe */}
            <iframe
              key={vimeoId}
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setShowFallback(false)}
              onError={() => setShowFallback(true)}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}