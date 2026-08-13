import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import MediaGrid from '../components/MediaGrid';
import Pagination from '../components/Pagination';
import StatsPanel from '../components/StatsPanel';
import './ExplorePage.css';

const DEFAULT_FILTERS = {
  sort: 'POPULARITY_DESC',
};

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const params = {
    page,
    query: search || undefined,
    ...filters,
  };

  const { data, loading, error } = useApi('/search', params);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="explore-page">
      <div className="container">
        <motion.div
          className="explore-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="explore-title">
            Explore <span>Everything</span>
          </h1>
          <p className="explore-subtitle">
            Search across anime, manga, manhwa, and donghua with powerful filters.
          </p>
        </motion.div>

        <div className="explore-search-row">
          <SearchBar value={search} onChange={handleSearch} />
        </div>

        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <div className="explore-layout">
          <div className="explore-main">
            {data && (
              <p className="explore-result-count">
                Showing <strong>{data.length}</strong> results
                {search && <> for &ldquo;{search}&rdquo;</>}
              </p>
            )}
            <MediaGrid data={data} loading={loading} error={error} />
            {data && data.length > 0 && (
              <Pagination
                page={page}
                onPageChange={setPage}
                hasMore={data.length === 25}
              />
            )}
          </div>
          <aside className="explore-aside">
            <StatsPanel data={data} />
          </aside>
        </div>
      </div>
    </div>
  );
}
