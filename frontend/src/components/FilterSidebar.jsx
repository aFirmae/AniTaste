import { motion } from 'framer-motion';
import './FilterSidebar.css';

const FILTER_OPTIONS = {
  type: { label: 'Type', options: ['', 'ANIME', 'MANGA'] },
  format: {
    label: 'Format',
    options: ['', 'TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT'],
  },
  status: {
    label: 'Status',
    options: ['', 'FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS'],
  },
  season: { label: 'Season', options: ['', 'WINTER', 'SPRING', 'SUMMER', 'FALL'] },
  country: {
    label: 'Country',
    options: [
      { value: '', label: 'Any' },
      { value: 'JP', label: '🇯🇵 Japan' },
      { value: 'KR', label: '🇰🇷 Korea' },
      { value: 'CN', label: '🇨🇳 China' },
      { value: 'TW', label: '🇹🇼 Taiwan' },
    ],
  },
  sort: {
    label: 'Sort By',
    options: [
      { value: 'POPULARITY_DESC', label: 'Most Popular' },
      { value: 'SCORE_DESC', label: 'Highest Rated' },
      { value: 'TRENDING_DESC', label: 'Trending' },
      { value: 'START_DATE_DESC', label: 'Newest' },
      { value: 'UPDATED_AT_DESC', label: 'Recently Updated' },
    ],
  },
};

const currentYear = new Date().getFullYear();
const YEARS = ['', ...Array.from({ length: 50 }, (_, i) => currentYear - i)];

function formatOption(opt) {
  if (typeof opt === 'object') return opt;
  return { value: opt, label: opt || 'Any' };
}

export default function FilterSidebar({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  return (
    <motion.div
      className="filter-sidebar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {Object.entries(FILTER_OPTIONS).map(([key, config]) => (
        <div className="filter-group" key={key}>
          <label className="filter-label" htmlFor={`filter-${key}`}>
            {config.label}
          </label>
          <select
            className="filter-select"
            id={`filter-${key}`}
            value={filters[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
          >
            {config.options.map((opt) => {
              const { value, label } = formatOption(opt);
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      ))}

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-year">Year</label>
        <select
          className="filter-select"
          id="filter-year"
          value={filters.seasonYear || ''}
          onChange={(e) => handleChange('seasonYear', e.target.value ? Number(e.target.value) : undefined)}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y || 'Any'}</option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button className="filter-reset" onClick={onReset} type="button">
          Reset Filters
        </button>
      </div>
    </motion.div>
  );
}
