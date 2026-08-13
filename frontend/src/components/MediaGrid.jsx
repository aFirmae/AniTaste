import { AnimatePresence } from 'framer-motion';
import MediaCard from './MediaCard';
import Skeleton from './Skeleton';
import './MediaGrid.css';

export default function MediaGrid({ data, loading, error }) {
  return (
    <div className="media-grid">
      {loading && <Skeleton count={25} />}

      {error && (
        <div className="media-grid-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && data?.length === 0 && (
        <div className="media-grid-empty">
          <h3>No results found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {!loading &&
          !error &&
          data?.map((media, i) => (
            <MediaCard key={media.id} media={media} index={i} />
          ))}
      </AnimatePresence>
    </div>
  );
}
