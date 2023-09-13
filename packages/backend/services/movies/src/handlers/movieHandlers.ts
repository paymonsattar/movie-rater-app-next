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

const fetchAverageRating = async (movieId: string) => {
  try {
    const response = await axios.get(`http://localhost:3002/reviews/${movieId}/average`);
    return response.data.averageRating;
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return null;
  }
};

// Get all movies
export const getAllMovies =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    try {
      const movies = await client.LRANGE('allMovies', 0, -1);

      if (!movies || movies.length === 0) {
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('No movies found'));
      }

      const parsedMovies: Movie[] = await Promise.all(movies.map(async movie => {
        const parsed = JSON.parse(movie);
        parsed.averageRating = await fetchAverageRating(parsed.id);

        return parsed;
      }));

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

      movie.averageRating = await fetchAverageRating(id);

      return sendHttpResponse(res, OK_RESPONSE(movie));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error fetching movie')
      );
    }
  };

// Create a new movie
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
      moviePoster 
    } = req.body;

    if (!title || !genres || !releaseDate || !description) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('title, description, genres, and releaseDate are required fields')
      );
    }

    if (typeof title !== 'string' || !Array.isArray(genres) || typeof description !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data types')
      );
    }

    if (isNaN(new Date(releaseDate).getTime())) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid data type: releaseDate must be a valid date')
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
      title,
      description,
      genres,
      director,
      runtime,
      actors,
      releaseDate,
      moviePoster
    };
    
    // Flatten the object into an array of strings
    type HSETObject = Record<string, string | number>;

    const hsetObject: HSETObject = {};
    
    for (const [key, value] of Object.entries(movieData)) {
      hsetObject[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    }
    
    try {
      console.log('movieData', movieData);
      console.log('hsetObject', hsetObject);
    
      // Use the JavaScript spread syntax to pass the array elements as arguments to HSET
      await client.HSET(`movies:${id}`, hsetObject);
    
      // Add the movie data to a list
      await client.RPUSH('allMovies', JSON.stringify(movieData));
    
      return sendHttpResponse(res, CREATED_RESPONSE(movieData));
    } catch (error) {
      console.log('error', error);
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE('Error creating movie')
      );
    }
  };
