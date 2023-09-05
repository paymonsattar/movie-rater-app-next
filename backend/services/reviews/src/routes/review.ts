import { Router } from 'express';
import { RedisClient } from '../types';
import * as handlers from '../handlers/reviewHandlers';

export const createMovieReviewRoutes = (client: RedisClient) => {
  const router = Router();

  router.post('/add-review', handlers.addReview(client));
  router.get('/movie-reviews/:movieId', handlers.getReviews(client));
  router.get('/movie-reviews-average/:movieId', handlers.getReviewAverage(client));

  return router;
};
