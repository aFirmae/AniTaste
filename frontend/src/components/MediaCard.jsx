import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './MediaCard.css';

export default function MediaCard({ media, index = 0 }) {
  const color = media.coverImage?.color || '#4F46E5';
  const poster = media.coverImage?.large || media.coverImage?.medium;
  const title = media.title?.english || media.title?.romaji || 'Unknown';
  const subtitle = media.title?.english ? media.title.romaji : null;
  const type = (media.type || '').toLowerCase();
  const genres = (media.genres || []).slice(0, 3);

  return (
      <Link to={`/anime/${media.id}`} className="media-card-link">
    <motion.div
      className="media-card"
      style={{
        boxShadow: `0 4px 20px ${color}18`,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.025,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -5,
        boxShadow: `0 12px 36px ${color}30`,
      }}
    >
      <div className="media-card-poster">
        {poster && (
          <img src={poster} alt={title} loading="lazy" draggable={false} />
        )}
        {type && (
          <span className={`media-card-badge ${type}`}>{type}</span>
        )}
      </div>
      <div className="media-card-info">
        <h3 className="media-card-title">{title}</h3>
        {subtitle && subtitle !== title && (
          <p className="media-card-subtitle">{subtitle}</p>
        )}
        {genres.length > 0 && (
          <div className="media-card-genres">
            {genres.map((g) => (
              <span className="media-card-genre-tag" key={g}>{g}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
    </Link>
  );
}
