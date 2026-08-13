import { motion } from 'framer-motion';
import './Pagination.css';

export default function Pagination({ page, onPageChange, hasMore }) {
  return (
    <motion.div
      className="pagination"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {page > 1 && (
        <button
          className="pagination-btn"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      )}

      {page > 2 && <span className="pagination-info">…</span>}

      <button className="pagination-btn active" aria-current="page">
        {page}
      </button>

      {hasMore && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(page + 1)}
          >
            {page + 1}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            Next →
          </button>
        </>
      )}
    </motion.div>
  );
}
