import { Router } from 'express';
import { RedisClient } from '../types';
import * as handlers from '../handlers/movieHandlers';

export const createMovieRoutes = (client: RedisClient) => {
  const router = Router();

  router.get('/', handlers.getAllMovies(client));
  router.get('/:id', handlers.getMovieById(client));
  router.post('/', handlers.createMovie(client));

  return router;
};
