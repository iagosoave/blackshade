// src/sections/DirectorsSection.jsx
import React, { useState } from 'react';
import DirectorsList from '../components/DirectorsList';
import DirectorPortfolio from '../components/DirectorPortfolio';
import useContentful from '../hocks/useContentful';

export default function DirectorsSection({ language, onVideoOpen }) {
  const [selectedDirector, setSelectedDirector] = useState(null);
  
  // Nomes dos diretores fixos no código
  const directors = [
    { id: '1', name: 'Gustavo Vargas' },
    { id: '2', name: 'Alice Demier' },
    { id: '3', name: 'Wolvz' }
  ];

  // Busca portfolio do diretor selecionado no Contentful
  const { data: portfolioData, loading } = useContentful(
    selectedDirector ? `director-${selectedDirector.id}` : null
  );

  // Se um diretor foi selecionado, adiciona o portfolio vindo do Contentful
  const directorWithPortfolio = selectedDirector ? {
    ...selectedDirector,
    portfolio: portfolioData || []
  } : null;

  return (
    <>
      {!selectedDirector ? (
        <DirectorsList 
          directors={directors} 
          onSelectDirector={setSelectedDirector}
        />
      ) : (
        <DirectorPortfolio 
          director={directorWithPortfolio} 
          onBack={() => setSelectedDirector(null)}
          loading={loading}
          onVideoOpen={onVideoOpen}
          language={language}
        />
      )}
    </>
  );
}