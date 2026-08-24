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
@limiter.limit("30/minute")
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

@app.get("/anime/{anime_id}")
@limiter.limit("30/minute")
def get_anime_details(request: Request, anime_id: int):

    query = '''
    query ($id: Int!) {
      Media(id: $id, type: ANIME) {

        id
        idMal

        title {
          romaji
          english
          native
          userPreferred
        }

        type
        format
        status
        description

        startDate {
          year
          month
          day
        }

        endDate {
          year
          month
          day
        }

        season
        seasonYear

        episodes
        duration

        countryOfOrigin
        isLicensed
        source

        hashtag

        trailer {
          id
          site
          thumbnail
        }

        updatedAt

        coverImage {
          extraLarge
          large
          medium
          color
        }

        bannerImage

        genres
        synonyms

        averageScore
        meanScore
        popularity
        trending
        favourites

        tags {
          id
          name
          description
          category
          rank
          isGeneralSpoiler
          isMediaSpoiler
          isAdult
        }

        relations {
          edges {
            id
            relationType

            node {
              id

              title {
                romaji
                english
                native
                userPreferred
              }

              type
              format
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

        characters(page: 1, perPage: 25) {
          edges {
            id
            role

            voiceActors {
              id

              name {
                first
                middle
                last
                full
                native
                userPreferred
              }

              languageV2

              image {
                large
                medium
              }

              description
              gender
              siteUrl
            }

            node {
              id

              name {
                first
                middle
                last
                full
                native
                userPreferred
              }

              image {
                large
                medium
              }

              description
              gender

              dateOfBirth {
                year
                month
                day
              }

              age
              bloodType
              siteUrl
              favourites
            }
          }
        }

        staff(page: 1, perPage: 25) {
          edges {
            id
            role

            node {
              id

              name {
                first
                middle
                last
                full
                native
                userPreferred
              }

              languageV2

              image {
                large
                medium
              }

              description
              gender
              siteUrl
              favourites
            }
          }
        }

        studios {
          edges {
            id
            isMain

            node {
              id
              name
              siteUrl
              favourites
            }
          }
        }

        isFavourite
        isFavouriteBlocked
        isAdult

        nextAiringEpisode {
          id
          airingAt
          timeUntilAiring
          episode
        }

        airingSchedule(page: 1, perPage: 25) {
          edges {
            id

            node {
              id
              airingAt
              timeUntilAiring
              episode
            }
          }
        }

        trends(page: 1, perPage: 25) {
          edges {
            node {
              date
              trending
              averageScore
              popularity
              inProgress
            }
          }
        }

        externalLinks {
          id
          url
          site
          siteId
          type
          language
          color
          icon
          notes
        }

        streamingEpisodes {
          title
          thumbnail
          url
          site
        }

        rankings {
          id
          rank
          type
          context
          year
          season
        }

        reviews(page: 1, perPage: 25) {
          edges {
            node {
              id

              user {
                id
                name

                avatar {
                  large
                  medium
                }
              }

              score
              summary
              body
              rating
              ratingAmount
              createdAt
              updatedAt
            }
          }
        }

        recommendations(page: 1, perPage: 25) {
          edges {
            node {
              id
              rating

              mediaRecommendation {
                id

                title {
                  romaji
                  english
                  native
                  userPreferred
                }

                type
                format
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
        }

        stats {
          scoreDistribution {
            score
            amount
          }

          statusDistribution {
            status
            amount
          }
        }

        siteUrl

        isRecommendationBlocked
        isReviewBlocked
      }
    }
    '''

    variables = {
        "id": anime_id
    }

    response = requests.post(
        url,
        json={
            "query": query,
            "variables": variables
        }
    )

    return response.json()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)