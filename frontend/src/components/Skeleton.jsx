import './Skeleton.css';

export default function Skeleton({ count = 25 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-poster" />
          <div className="skeleton-info">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-line tag" />
          </div>
        </div>
      ))}
    </>
  );
}
