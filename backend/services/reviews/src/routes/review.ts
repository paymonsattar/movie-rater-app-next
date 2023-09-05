import { Router } from 'express';
import { RedisClient } from '../types';
import * as handlers from '../handlers/reviewHandlers';

export const createMovieReviewRoutes = (client: RedisClient) => {
  const router = Router();

  router.post('/', handlers.addReview(client));
  router.get('/:id', handlers.getReviews(client));
  router.get('/:id', handlers.getReviewAverage(client));

  return router;
};
