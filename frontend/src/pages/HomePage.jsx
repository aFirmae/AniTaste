import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import GenreTabs from '../components/GenreTabs';
import MediaGrid from '../components/MediaGrid';
import Pagination from '../components/Pagination';
import './HomePage.css';

function BentoHero({ items }) {
  if (!items || items.length < 5) return null;
  const top5 = items.slice(0, 5);

  return (
    <section className="bento-section">
      <p className="bento-label">Trending right now</p>
      <div className="bento-grid">
        {top5.map((media, i) => {
          const color = media.coverImage?.color || '#4F46E5';
          const poster = media.coverImage?.extraLarge || media.coverImage?.large;
          const title = media.title?.english || media.title?.romaji || 'Unknown';
          const genres = (media.genres || []).slice(0, 3);

          return (
            <motion.div
              className="bento-cell"
              key={media.id}
              style={{ boxShadow: `0 8px 30px ${color}22` }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ boxShadow: `0 12px 40px ${color}40` }}
            >
              {poster && (
                <img src={poster} alt={title} draggable={false} />
              )}
              <div className="bento-cell-info">
                {i === 0 && <p className="bento-cell-rank">Most popular</p>}
                <h2 className="bento-cell-title">{title}</h2>
                {i === 0 && genres.length > 0 && (
                  <div className="bento-cell-genres">
                    {genres.map((g) => (
                      <span className="bento-cell-genre" key={g}>{g}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [genre, setGenre] = useState(null);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useApi('/', { page, genre });

  const handleGenreChange = (g) => {
    setGenre(g);
    setPage(1);
  };

  return (
    <div className="home-page">
      <div className="container">
        {/* Bento Hero — only show on page 1 with no genre filter */}
        {!loading && data && page === 1 && !genre && (
          <BentoHero items={data} />
        )}

        {/* Section */}
        <div className="section-header">
          <h2 className="section-title">
            {genre || 'Popular'}
          </h2>
          <span className="section-subtitle">
            {genre ? 'genre' : 'across all genres'}
          </span>
        </div>

        <GenreTabs active={genre} onChange={handleGenreChange} />
        <MediaGrid data={data} loading={loading} error={error} />

        {data && data.length > 0 && (
          <Pagination page={page} onPageChange={setPage} hasMore={data.length === 25} />
        )}
      </div>
    </div>
  );
}
