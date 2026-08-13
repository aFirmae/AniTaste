import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './StatsPanel.css';

const GENRE_COLORS = {
  Action: '#ef4444',
  Adventure: '#f97316',
  Comedy: '#eab308',
  Drama: '#8b5cf6',
  Fantasy: '#6366f1',
  Horror: '#991b1b',
  Mystery: '#0ea5e9',
  Romance: '#ec4899',
  'Sci-Fi': '#14b8a6',
  'Slice of Life': '#84cc16',
  Supernatural: '#a855f7',
  Thriller: '#f43f5e',
  Sports: '#22c55e',
  Mecha: '#64748b',
  Music: '#d946ef',
  Psychological: '#7c3aed',
};

export default function StatsPanel({ data }) {
  const genreCounts = useMemo(() => {
    if (!data || data.length === 0) return [];
    const counts = {};
    data.forEach((m) => {
      (m.genres || []).forEach((g) => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [data]);

  if (genreCounts.length === 0) return null;

  const maxCount = genreCounts[0]?.[1] || 1;

  return (
    <motion.div
      className="stats-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <h3 className="stats-panel-title">Genre Distribution</h3>
      <div className="stats-bars">
        {genreCounts.map(([genre, count], i) => (
          <div className="stats-bar-row" key={genre}>
            <span className="stats-bar-label">{genre}</span>
            <div className="stats-bar-track">
              <motion.div
                className="stats-bar-fill"
                style={{
                  background: GENRE_COLORS[genre] || '#8b5cf6',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(count / maxCount) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="stats-bar-count">{count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
