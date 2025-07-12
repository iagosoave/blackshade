import { useState, useEffect } from 'react';
import { createClient } from 'contentful';

const client = createClient({
  space: "eq48j1dbpqsr",
  accessToken: "GhKBzoLISOk91Q3midcY46iz1pdOlUQcGzGiKhPQycU"
});

export default function useContentful(contentType) {
  const [data, setData] = useState(null);
  // CORREÇÃO AQUI: Use useState para inicializar o estado 'loading'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentType) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        let response;

        // Para portfolio de diretores específicos
        if (contentType.startsWith('director-')) {
          const directorId = contentType.replace('director-', '');
          const directorMap = {
            'gustavo-vargas': 'gustavo-vargas',
            'alice-demier': 'alice-demier',
            'wolvz': 'wolvz',
            'rafa-rocha': 'rafa-rocha',
            'renata-massetti': 'renata-massetti'
          };

          response = await client.getEntries({
            content_type: 'portfolioItem',
            'fields.director': directorMap[directorId],
            order: 'fields.order'
          });

          const portfolioItems = response.items.map(item => ({
            id: item.sys.id,
            title: item.fields.title,
            thumbnail: item.fields.thumbnail?.fields?.file?.url
              ? `https:${item.fields.thumbnail.fields.file.url}`
              : '',
            videoUrl: item.fields.videoUrl || '',
            description: item.fields.description
          }));

          setData(portfolioItems);
        }
        // Para música
        else if (contentType === 'music') {
          response = await client.getEntries({
            content_type: 'musicItem',
            order: 'fields.order'
          });

          const musicItems = response.items.map(item => ({
            id: item.sys.id,
            title: item.fields.title,
            thumbnail: item.fields.thumbnail?.fields?.file?.url
              ? `https:${item.fields.thumbnail.fields.file.url}`
              : '',
            mediaUrl: item.fields.mediaUrl || '',
            videoUrl: item.fields.videoUrl || '',
            description: item.fields.description,
            artist: item.fields.artist || ''
          }));

          setData(musicItems);
        }
        // Para IA
        else if (contentType === 'ai') {
          response = await client.getEntries({
            content_type: 'aiItem',
            order: 'fields.order'
          });

          const aiItems = response.items.map(item => ({
            id: item.sys.id,
            title: item.fields.title,
            thumbnail: item.fields.thumbnail?.fields?.file?.url
              ? `https:${item.fields.thumbnail.fields.file.url}`
              : '',
            projectUrl: item.fields.projectUrl || '',
            videoUrl: item.fields.videoUrl || '',
            description: item.fields.description,
            technologies: item.fields.technologies || ''
          }));

          setData(aiItems);
        }
        // Para homepage
        else if (contentType === 'homepage') {
          response = await client.getEntries({
            content_type: 'homepage',
            limit: 1
          });

          if (response.items.length > 0) {
            const item = response.items[0];
            const homepageData = {
              siteTitle: item.fields.siteTitle || 'BLACKSHADE',
              backgroundVideo: item.fields.backgroundVideo?.fields?.file?.url || null,
              videoUrl: item.fields.videoUrl || null,
              posterImage: item.fields.posterImage?.fields?.file?.url || null
            };
            setData(homepageData);
          } else {
            setData(null);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Contentful:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType]);

  return { data, loading };
}