import axios from 'axios';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RedisClient } from '../redisClient';
import {
  IResponse,
  sendHttpResponse,
  OK_RESPONSE,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
  CREATED_RESPONSE,
  Movie,
} from '@movie-rater/backend-common';

/**
 * 📚 This module contains the handlers for managing movies in the application.
 *
 * Each handler function is a higher-order function that takes a Redis client
 * and returns an Express middleware function. The handlers are responsible for
 * the following functionalities:
 *
 * - `getAllMovies`: Fetches all movies from the database and calculates their average ratings.
 * - `getMovieById`: Fetches a single movie by its ID from the database.
 * - `createMovie`: Adds a new movie to the database.
 *
 * @module MovieHandlers
 */

// 🧠 This utility function fetches the average rating for a movie from a separate service.
// This is done to keep the concerns of rating and movie data separate.
const fetchAverageRating = async (movieId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3002/reviews/${movieId}/average`
    );
    return response.data.body.average;
  } catch (error) {
    return 0; // 🧠 Default to 0 if the review service fails
  }
};

// 👇️ Handler for fetching all movies
export const getAllMovies =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    try {
      // 🧠 Using Redis to quickly fetch all movies
      const movies = await client.LRANGE('allMovies', 0, -1);
      if (!movies || movies.length === 0) {
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('No movies found'));
      }

      // 🧠 Enriching movie data with average ratings
      const parsedMovies: Movie[] = await Promise.all(
        movies.map(async movie => {
          const parsed = JSON.parse(movie);
          parsed.averageRating = await fetchAverageRating(parsed.id);
          if (typeof parsed.genres === 'string') {
            parsed.genres = JSON.parse(parsed.genres);
          }
          return parsed;
        })
      );

      return sendHttpResponse(res, OK_RESPONSE(parsedMovies));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error fetching movies')
      );
    }
  };

// 👇️ Handler for fetching a movie by its ID
export const getMovieById =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid movie ID format')
      );
    }

    try {
      // 🧠 Using Redis' HGETALL for efficient retrieval by key
      const movie = (await client.HGETALL(`movies:${id}`)) as unknown as Movie;
      if (!movie || Object.keys(movie).length === 0) {
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('Movie not found'));
      }

      // 🧠 Parsing genres if they are stored as a string
      if (typeof movie.genres === 'string') {
        movie.genres = JSON.parse(movie.genres);
      }

      // 🧠 Adding average rating to the movie data
      movie.averageRating = await fetchAverageRating(movie.id);

      return sendHttpResponse(res, OK_RESPONSE(movie));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error fetching movie')
      );
    }
  };

// 👇️ Handler for creating a new movie
export const createMovie =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const {
      title,
      description,
      genres,
      director,
      runtime,
      actors,
      releaseDate,
      moviePoster,
    } = req.body;

    // 🧠 Validating required fields to ensure data integrity
    if (
      !title ||
      !genres ||
      genres.length < 1 ||
      !releaseDate ||
      !description
    ) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE(
          'title, description, genres, and releaseDate are required fields'
        )
      );
    }

    // 🧠 Type validation
    if (typeof title !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data type: title must be a string')
      );
    }

    if (!Array.isArray(genres)) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data type: genres must be an array')
      );
    }

    if (typeof releaseDate !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data type: releaseDate must be a string')
      );
    }

    if (typeof moviePoster !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data type: moviePoster must be a string')
      );
    }

    const id = uuidv4();
    const movieData: Movie = {
      id,
      title,
      description,
      genres,
      director,
      runtime,
      actors,
      releaseDate,
      moviePoster,
    };

    // 🧠 Flattening the object for Redis HSET
    type HSETObject = Record<string, string | number>;
    const hsetObject: HSETObject = {};
    for (const [key, value] of Object.entries(movieData)) {
      hsetObject[key] =
        typeof value === 'object' ? JSON.stringify(value) : value;
    }

    try {
      // 🧠 Using Redis' HSET and RPUSH for efficient data storage
      await client.HSET(`movies:${id}`, hsetObject);
      await client.RPUSH('allMovies', JSON.stringify(movieData));

      const help = sendHttpResponse(res, CREATED_RESPONSE(movieData));

      return sendHttpResponse(res, CREATED_RESPONSE(movieData));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error creating movie')
      );
    }
  };
