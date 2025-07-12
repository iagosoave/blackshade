import React, { useState } from 'react';
import DirectorsList from '../components/DirectorsList';
import DirectorPortfolio from '../components/DirectorPortfolio';
import useContentful from '../hocks/useContentful';

export default function DirectorsSection({ language, onVideoOpen }) {
  const [selectedDirector, setSelectedDirector] = useState(null);

  const directors = [
    { id: 'alice-demier', name: 'Alice Demier', bannerImage: '' },
    { id: 'gustavo-vargas', name: 'Gus Vargas', bannerImage: '' },
    { id: 'rafa-rocha', name: 'Rafa Rocha', bannerImage: '' },
    { id: 'renata-massetti', name: 'Renata Massetti', bannerImage: '' },
    { id: 'wolvz', name: 'Wolvz Duo', bannerImage: '' }
  ];

  const { data: portfolioData, loading } = useContentful(
    selectedDirector ? `director-${selectedDirector.id}` : null
  );

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