import { Router } from 'express';
import { RedisClient } from '../redisClient';
import * as handlers from '../handlers/reviewHandlers';

export const createMovieReviewRoutes = (client: RedisClient) => {
  const router = Router();

  router.post('/', handlers.addReview(client));
  router.get('/:movieId', handlers.getReviews(client));
  router.get('/:movieId/average', handlers.getReviewAverage(client));

  return router;
};
