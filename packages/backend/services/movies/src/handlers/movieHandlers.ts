import { Request, Response } from 'express';
import { RedisClient } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  IResponse,
  OK_RESPONSE,
  BAD_REQUEST_RESPONSE,
} from '@movie-rater/backend-common';
// Get all movies
export const getAllMovies =
  (client: RedisClient) => async (req: Request, res: Response) => {
    try {
      const movies = await client.LRANGE('allMovies', 0, -1);

      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: 'No movies found' });
      }
      const parsedMovies = movies.map(movie => JSON.parse(movie));

      return sendHttpResponse(res, OK_RESPONSE(parsedMovies));
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching movies' });
    }
  };

// Get a single movie by ID
export const getMovieById =
  (client: RedisClient) => async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid movie ID format')
      );
    }

    try {
      const movie = await client.HGETALL(`movies:${id}`);

      if (!movie || Object.keys(movie).length === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      return sendHttpResponse(res, OK_RESPONSE(movie));
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching movie' });
    }
  };

export const createMovie =
  (client: RedisClient) => async (req: Request, res: Response) => {
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

    const id = uuidv4(); // Generate a unique identifier for the new movie

    const movieData = {
      moviePoster,
      title,
      genre,
      releaseDate,
    };

    try {
      await client.HSET(`movies:${id}`, movieData);

      // Add the new movie to the list of all movies
      await client.RPUSH('allMovies', JSON.stringify({ id, ...movieData }));

      return res.status(201).json({ id, ...movieData });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating movie' });
    }
  };

const sendHttpResponse = (res: Response, httpResponse: IResponse) => {
  return res.status(httpResponse.code).json(httpResponse);
};
