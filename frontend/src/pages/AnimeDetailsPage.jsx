import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import './AnimeDetailsPage.css';

export default function AnimeDetailsPage() {
  const { id } = useParams();

  const {
    data: anime,
    loading,
    error,
  } = useApi(`/anime/${id}`);

  if (loading) {
    return (
      <div className="anime-details-loading">
        Loading anime...
      </div>
    );
  }

  if (error) {
    return (
      <div className="anime-details-error">
        Error: {error}
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="anime-details-empty">
        Anime not found.
      </div>
    );
  }

  const title =
    anime.title?.english ||
    anime.title?.romaji ||
    'Unknown';

  return (
    <div className="anime-details-page">
      <div className="anime-details-container">

        <section className="anime-details-hero">

          <div className="anime-details-poster">
            <img
              src={anime.coverImage?.extraLarge}
              alt={title}
            />
          </div>

          <div className="anime-details-content">

            <h1 className="anime-details-title">
              {title}
            </h1>

            {anime.description && (
              <p
                className="anime-details-description"
                dangerouslySetInnerHTML={{
                  __html: anime.description,
                }}
              />
            )}

            <div className="anime-details-meta">
              {anime.averageScore && (
                <span>
                  ★ {anime.averageScore}%
                </span>
              )}

              {anime.episodes && (
                <span>
                  {anime.episodes} Episodes
                </span>
              )}

              {anime.status && (
                <span>
                  {anime.status}
                </span>
              )}

              {anime.format && (
                <span>
                  {anime.format}
                </span>
              )}

              {anime.season && anime.seasonYear && (
                <span>
                  {anime.season} {anime.seasonYear}
                </span>
              )}
            </div>

            {anime.genres?.length > 0 && (
              <div className="anime-details-genres">
                {anime.genres.map((genre) => (
                  <span
                    className="anime-details-genre"
                    key={genre}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

          </div>

        </section>

      </div>
    </div>
  );
}