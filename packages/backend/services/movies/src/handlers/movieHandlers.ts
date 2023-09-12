import { Request, Response } from 'express';
import { Movie, RedisClient } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  IResponse,
  sendHttpResponse,
  OK_RESPONSE,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
  CREATED_RESPONSE,
} from '@movie-rater/backend-common';

// Get all movies
export const getAllMovies =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    try {
      const movies = await client.LRANGE('allMovies', 0, -1);

      if (!movies || movies.length === 0) {
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('No movies found'));
      }

      const parsedMovies: Movie[] = movies.map(movie => JSON.parse(movie)); // Using the Movie interface

      return sendHttpResponse(res, OK_RESPONSE(parsedMovies));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error fetching movies')
      );
    }
};

// Get a single movie by ID
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
      const movie = await client.HGETALL(`movies:${id}`) as unknown as Movie;

      if (!movie || Object.keys(movie).length === 0) {
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('Movie not found'));
      }

      return sendHttpResponse(res, OK_RESPONSE(movie));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error fetching movie')
      );
    }
};

export const createMovie =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const { moviePoster, title, genre, releaseDate } = req.body;

    if (!title || !genre || !releaseDate) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE(
          'title, genre, and releaseDate are required fields'
        )
      );
    }

    if (typeof title !== 'string' || typeof genre !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE(
          'Invalid data types: title and genre must be strings'
        )
      );
    }

    if (isNaN(new Date(releaseDate).getTime())) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE(
          'Invalid data type: releaseDate must be a date type'
        )
      );
    }

    if (moviePoster && typeof moviePoster !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data type: moviePoster must be a string')
      );
    }

    const id = uuidv4();
    const movieData: Movie = {
      id,
      moviePoster,
      title,
      genre,
      releaseDate
    };

    try {
      await client.HSET(`movies:${id}`, movieData as Record<string, any>); // Using the Movie interface

      // Add the new movie to the list of all movies
      await client.RPUSH('allMovies', JSON.stringify(movieData));

      return sendHttpResponse(res, CREATED_RESPONSE(movieData));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error creating movie')
      );
    }
};
