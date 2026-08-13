import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
url = 'https://graphql.anilist.co'

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

from typing import Optional

@app.get("/")
@limiter.limit("50/minute")
def get_home(request: Request, page: int = 1, genre: Optional[str] = None):
    query = '''
    query ($page: Int, $genre: String) {
      Page (page: $page, perPage: 25) {
        media (sort: POPULARITY_DESC, genre: $genre) {
          id
          title {
            romaji
            english
          }
          genres
          type
          coverImage {
            extraLarge
            large
            medium
            color
          }
        }
      }
    }
    '''
    variables = {k: v for k, v in {
        "page": page,
        "genre": genre
    }.items() if v is not None}
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

@app.get("/search")
@limiter.limit("50/minute")
def search_media(
    request: Request,
    page: int = 1,
    query: Optional[str] = None,
    id: Optional[int] = None,
    type: Optional[str] = None,
    format: Optional[str] = None,
    status: Optional[str] = None,
    season: Optional[str] = None,
    seasonYear: Optional[int] = None,
    genre: Optional[str] = None,
    country: Optional[str] = None,
    isAdult: Optional[bool] = None,
    sort: str = "POPULARITY_DESC"
):
    graphql_query = '''
    query (
      $page: Int,
      $search: String,
      $id: Int,
      $type: MediaType,
      $format: MediaFormat,
      $status: MediaStatus,
      $season: MediaSeason,
      $seasonYear: Int,
      $genre: String,
      $countryOfOrigin: CountryCode,
      $isAdult: Boolean,
      $sort: [MediaSort]
    ) {
      Page (page: $page, perPage: 25) {
        media (
          search: $search,
          id: $id,
          type: $type,
          format: $format,
          status: $status,
          season: $season,
          seasonYear: $seasonYear,
          genre: $genre,
          countryOfOrigin: $countryOfOrigin,
          isAdult: $isAdult,
          sort: $sort
        ) {
          id
          title {
            romaji
            english
          }
          genres
          type
          format
          countryOfOrigin
          status
          coverImage {
            extraLarge
            large
            medium
            color
          }
        }
      }
    }
    '''
    variables = {k: v for k, v in {
        "page": page,
        "search": query,
        "id": id,
        "type": type,
        "format": format,
        "status": status,
        "season": season,
        "seasonYear": seasonYear,
        "genre": genre,
        "countryOfOrigin": country,
        "isAdult": isAdult,
        "sort": sort
    }.items() if v is not None}
    
    response = requests.post(url, json={'query': graphql_query, 'variables': variables})
    return response.json()
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)