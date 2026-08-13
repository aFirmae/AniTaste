# AniTaste Backend API Documentation

This document describes the API routes available in the AniTaste backend, including all possible query parameters, their types, and examples of how to combine them to achieve complex filtering.

## Base URL
When running locally, the base URL is:
`http://localhost:8000`

---

## 1. Home Endpoint

Fetches the most popular media in the database (both Anime and Manga). It is paginated and returns 25 items per page.

**Endpoint:** `GET /`

### Query Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `int` | No | `1` | The page number for pagination. |
| `genre` | `str` | No | `None` | Filter by a specific genre (e.g. `Action`, `Romance`, `Sci-Fi`). |

### Examples

**Basic Fetch (Top 25 Media overall):**
```bash
curl "http://localhost:8000/"
```

**Fetch Top 25 Action Media:**
```bash
curl "http://localhost:8000/?genre=Action"
```

**Fetch Page 3 of Romance Media:**
```bash
curl "http://localhost:8000/?genre=Romance&page=3"
```

---

## 2. Advanced Search Endpoint

This endpoint is a powerful search engine that queries the AniList GraphQL API. It allows you to stack numerous filters.

**Endpoint:** `GET /search`

### Query Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `int` | No | `1` | The page number for pagination. |
| `query` | `str` | No | `None` | Text search against Romaji and English titles. |
| `id` | `int` | No | `None` | Exact AniList ID of the media. |
| `type` | `str` | No | `None` | Media type: `ANIME` or `MANGA`. |
| `format` | `str` | No | `None` | Media format: `TV`, `MOVIE`, `MANGA`, `NOVEL`, `ONE_SHOT`, `OVA`, `ONA`, `MUSIC`, `SPECIAL`. |
| `status` | `str` | No | `None` | Media release status: `FINISHED`, `RELEASING`, `NOT_YET_RELEASED`, `CANCELLED`, `HIATUS`. |
| `season` | `str` | No | `None` | Season of release: `WINTER`, `SPRING`, `SUMMER`, `FALL`. |
| `seasonYear` | `int` | No | `None` | Year of release (e.g., `2024`). |
| `genre` | `str` | No | `None` | Genre filter (e.g., `Action`, `Comedy`). |
| `country` | `str` | No | `None` | Country of origin: `JP` (Japan), `KR` (Korea), `CN` (China), `TW` (Taiwan). |
| `isAdult` | `bool` | No | `None` | `true` to show 18+ content, `false` to hide it. |
| `sort` | `str` | No | `POPULARITY_DESC` | Sort order: `POPULARITY_DESC`, `SCORE_DESC`, `TRENDING_DESC`, `UPDATED_AT_DESC`, `START_DATE_DESC`, etc. |

### Powerful Combinations & Examples

**1. General Search (Title lookup):**
```bash
curl "http://localhost:8000/search?query=Attack%20on%20Titan"
```

**2. Find Korean Manhwa:**
By combining `country=KR` and optionally `format=MANGA`, we can isolate Korean webtoons/manhwa.
```bash
curl "http://localhost:8000/search?country=KR&type=MANGA"
```

**3. Find Chinese Donghua:**
By combining `country=CN` and `type=ANIME`, we can find Chinese animated series.
```bash
curl "http://localhost:8000/search?country=CN&type=ANIME"
```

**4. Find Top Rated Finished Manga:**
Find manga that are completely finished, sorted by their user score.
```bash
curl "http://localhost:8000/search?type=MANGA&status=FINISHED&sort=SCORE_DESC"
```

**5. Find Anime from a Specific Season:**
Find the most popular anime airing in Winter 2024.
```bash
curl "http://localhost:8000/search?type=ANIME&season=WINTER&seasonYear=2024&sort=POPULARITY_DESC"
```

**6. Find Highly Trending Movies:**
Find Anime movies that are currently trending.
```bash
curl "http://localhost:8000/search?format=MOVIE&sort=TRENDING_DESC"
```

**7. Ultimate Stacked Filter (The "I know exactly what I want" query):**
A finished, highly-rated, Japanese Anime Movie in the Action genre from 1995.
```bash
curl "http://localhost:8000/search?type=ANIME&format=MOVIE&status=FINISHED&country=JP&genre=Action&seasonYear=1995&sort=SCORE_DESC"
```

## Response Format

Both the `/` and `/search` endpoints return a JSON object originating from AniList's GraphQL API. The returned structure looks like this:

```json
{
  "data": {
    "Page": {
      "media": [
        {
          "id": 16498,
          "title": {
            "romaji": "Shingeki no Kyojin",
            "english": "Attack on Titan"
          },
          "genres": ["Action", "Drama", "Fantasy", "Mystery"],
          "type": "ANIME",
          "format": "TV",
          "countryOfOrigin": "JP",
          "status": "FINISHED",
          "coverImage": {
            "extraLarge": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg",
            "large": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg",
            "medium": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx16498-buvcRTBx4NSm.jpg",
            "color": "#f1a143"
          }
        }
      ]
    }
  }
}
```

> [!TIP]
> Use the `color` property from `coverImage` as a dynamic background or accent color in your frontend UI to make the design pop!

---

## Rate Limiting

The backend uses `slowapi` to enforce strict rate limits across all endpoints to prevent API abuse.

- **Limit:** 50 requests per minute per IP address.
- **Exceeding the limit:** Returns a `429 Too Many Requests` status code.
