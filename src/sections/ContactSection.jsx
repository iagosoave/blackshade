import React, { useRef, useEffect } from 'react'; // useRef e useEffect são necessários para o vídeo
import { motion } from 'framer-motion';
import { FaInstagram, FaVimeoV, FaWhatsapp } from 'react-icons/fa';
import { translations } from '../config/translations';
import backgroundVideo from '../video.mp4'; // IMPORTANTE: Verifique se o caminho para o vídeo está correto aqui!

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
          // Opcional: Adicionar um fallback para clique do usuário se o autoplay for bloqueado
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
  }, []); // [] para rodar uma vez no mount

  return (
    <div className="min-h-screen relative">
      {/* Vídeo de Background AGORA DENTRO DO ContactSection */}
      <div className="absolute inset-0 w-full h-full overflow-hidden"> {/* Adicionado overflow-hidden para garantir que o vídeo não saia do container */}
        <video
          ref={videoRef}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          controls={false}
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3, pointerEvents: 'none' }} // Opacidade fixa em 0.3 (30%)
        >
          <source src={backgroundVideo} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>

      {/* Conteúdo do Contato - Z-index maior para ficar acima do vídeo */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-8">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white space-y-6 md:space-y-8">

            {/* Email Geral Black Shade */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                {contactData.fields.email}
              </p>
              <a
                href={`mailto:${contactData.info.email}`}
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-block break-all"
              >
                {contactData.info.email}
              </a>
            </motion.div>

            {/* Produção Executiva - Gus Vargas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                {contactData.fields.producaoExecutiva} - {contactData.info.gusVargas.nome}
              </p>
              <a
                href={`https://wa.me/${contactData.info.gusVargas.cel.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-flex items-center space-x-2"
              >
                <FaWhatsapp className="text-xl" /> {contactData.info.gusVargas.cel}
              </a>
              <a
                href={`mailto:${contactData.info.gusVargas.email}`}
                className="text-sm opacity-80 mt-1 hover:opacity-100 transition-opacity block break-all"
              >
                {contactData.info.gusVargas.email}
              </a>
            </motion.div>

            {/* Atendimento - Rodrigo Sivieri */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                {contactData.fields.atendimento} - {contactData.info.rodrigoSivieri.nome}
              </p>
              <a
                href={`https://wa.me/${contactData.info.rodrigoSivieri.cel.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:opacity-70 transition-opacity inline-flex items-center space-x-2"
              >
                <FaWhatsapp className="text-xl" /> {contactData.info.rodrigoSivieri.cel}
              </a>
              <a
                href={`mailto:${contactData.info.rodrigoSivieri.email}`}
                className="text-sm opacity-80 mt-1 hover:opacity-100 transition-opacity block break-all"
              >
                {contactData.info.rodrigoSivieri.email}
              </a>
            </motion.div>

            {/* Redes Sociais */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-3 whitespace-nowrap">
                {contactData.fields.instagram}
              </p>
              <div className="flex gap-4">
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

            {/* Endereço */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="opacity-60 text-xs md:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                {contactData.fields.address}
              </p>
              <p className="text-base md:text-lg whitespace-nowrap">
                {contactData.info.address}
              </p>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}