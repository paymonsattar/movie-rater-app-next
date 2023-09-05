import { Request, Response } from 'express';
import { RedisClient } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Get all movies
export const getAllMovies = (client: RedisClient) => async (req: Request, res: Response) => {
  try {
    const movies = await client.LRANGE('allMovies', 0, -1);
    const parsedMovies = movies.map(movie => JSON.parse(movie));
    return res.status(200).json(parsedMovies);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching movies' });
  }
};

// Get a single movie by ID
export const getMovieById = (client: RedisClient) => async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const movie = await client.HGETALL(`movie:${id}`);
    if (!movie || Object.keys(movie).length === 0) return res.status(404).json({ message: 'Movie not found' });

    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching movie' });
  }
};

// Create a new movie
export const createMovie = (client: RedisClient) => async (req: Request, res: Response) => {
  const { moviePoster, title, genre, releaseDate } = req.body;
  const id = uuidv4(); // Generate a unique identifier for the new movie

  const movieData = {
    moviePoster,
    title,
    genre,
    releaseDate,
    averageRating: '0', // Initialize average rating to 0
  };

  try {
    await client.HSET(`movie:${id}`, movieData);

    // Add the new movie to the list of all movies
    await client.RPUSH('allMovies', JSON.stringify({ id, ...movieData }));

    return res.status(201).json({ id, ...movieData });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating movie' });
  }
};


