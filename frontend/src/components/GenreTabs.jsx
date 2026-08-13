import { motion } from 'framer-motion';
import './GenreTabs.css';

const GENRES = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

export default function GenreTabs({ active, onChange }) {
  return (
    <div className="genre-tabs" role="tablist" aria-label="Filter by genre">
      {GENRES.map((genre) => {
        const isActive = active === genre || (genre === 'All' && !active);
        return (
          <motion.button
            key={genre}
            className={`genre-tab${isActive ? ' active' : ''}`}
            onClick={() => onChange(genre === 'All' ? null : genre)}
            role="tab"
            aria-selected={isActive}
            whileTap={{ scale: 0.95 }}
          >
            <span>{genre}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
