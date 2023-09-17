import { Router } from 'express';
import { RedisClient } from '../redisClient';
import * as handlers from '../handlers/movieHandlers';

/**
 * 📚 RESTful API routes for managing movies.
 *
 * GET /: Fetches all movies
 * GET /:id: Fetches a movie by its ID
 * POST /: Adds a new movie
 *
 * @module MovieRoutes
 */
export const createMovieRoutes = (client: RedisClient) => {
  const router = Router();

  // 👇️ Defining the available routes and their handlers
  router.get('/', handlers.getAllMovies(client));
  router.get('/:id', handlers.getMovieById(client));
  router.post('/', handlers.createMovie(client));

  return router;
};
