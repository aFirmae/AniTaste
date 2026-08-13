import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search anime, manga, manhwa...' }) {
  const [local, setLocal] = useState(value || '');
  const timerRef = useRef(null);

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), 350);
  };

  const handleClear = () => {
    setLocal('');
    onChange('');
  };

  return (
    <motion.div
      className={`search-bar-wrapper${local ? ' has-value' : ''}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        className="search-bar"
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search media"
        id="search-input"
      />
      <span className="search-bar-icon" aria-hidden="true">🔍</span>
      <button
        className="search-bar-clear"
        onClick={handleClear}
        aria-label="Clear search"
        type="button"
      >
        ✕
      </button>
    </motion.div>
  );
}
