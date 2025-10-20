import React from 'react';
import { FaInstagram, FaVimeoV, FaWhatsapp } from 'react-icons/fa';
import { translations } from '../config/translations';
import SingleVideoBackground from '../components/SingleVideoBackground';

export default function ContactSection({ language }) {
  const t = translations[language] || translations.pt;
  const contactData = t.contact;

  return (
    <div className="min-h-screen relative">
      {/* Vídeo de fundo simples */}
      <SingleVideoBackground 
        videoUrl="/videos/02.webm" 
        opacity={0.3}
      />

      {/* Conteúdo do contato */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl w-full text-center">
          <div className="text-white space-y-5 md:space-y-6 lg:space-y-8">
            {/* Email */}
            <div className="text-center">
              <p className="opacity-60 text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-wider mb-1 whitespace-nowrap">
                {contactData.fields.email}
              </p>
              <a
                href={`mailto:${contactData.info.email}`}
                className="text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity inline-block whitespace-nowrap"
              >
                {contactData.info.email}
              </a>
            </div>

            {/* Gus Vargas */}
            <div className="text-center">
              <p className="opacity-60 text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {contactData.fields.executiveProduction} - {contactData.info.gusVargas.nome}
              </p>
              <div className="flex flex-col items-center">
                <a
                  href={`https://wa.me/${contactData.info.gusVargas.cel.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity inline-flex items-center justify-center space-x-1 whitespace-nowrap"
                >
                  <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
                  <span>{contactData.info.gusVargas.cel}</span>
                </a>
                <a
                  href={`mailto:${contactData.info.gusVargas.email}`}
                  className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm opacity-80 mt-0.5 hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {contactData.info.gusVargas.email}
                </a>
              </div>
            </div>

            {/* Rodrigo Sivieri */}
            <div className="text-center">
              <p className="opacity-60 text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {contactData.fields.service} - {contactData.info.rodrigoSivieri.nome}
              </p>
              <div className="flex flex-col items-center">
                <a
                  href={`https://wa.me/${contactData.info.rodrigoSivieri.cel.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity inline-flex items-center justify-center space-x-1 whitespace-nowrap"
                >
                  <FaWhatsapp className="text-sm sm:text-base md:text-lg" />
                  <span>{contactData.info.rodrigoSivieri.cel}</span>
                </a>
                <a
                  href={`mailto:${contactData.info.rodrigoSivieri.email}`}
                  className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm opacity-80 mt-0.5 hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {contactData.info.rodrigoSivieri.email}
                </a>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="text-center">
              <p className="opacity-60 text-[10px] md:text-xs uppercase tracking-wider mb-3 whitespace-nowrap">
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
                  <FaInstagram size={24} />
                </a>
                <a
                  href={contactData.info.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Vimeo"
                >
                  <FaVimeoV size={24} />
                </a>
              </div>
            </div>

            {/* Endereço */}
           
          </div>
        </div>
      </div>
    </div>
  );
}