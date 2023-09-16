import { Router } from 'express';
import { RedisClient } from '../redisClient';
import * as handlers from '../handlers/reviewHandlers';

// 🧠 RESTful API routes for managing movie reviews.
// POST /reviews: Adds a new review
// GET /reviews/:movieId: Retrieves reviews for a specific movie
// GET /reviews/:movieId/average: Retrieves the average rating for a specific movie
export const createMovieReviewRoutes = (client: RedisClient) => {
  const router = Router();

  // 👇️ Defining the available routes and their handlers
  router.post('/', handlers.addReview(client));
  router.get('/:movieId', handlers.getReviews(client));
  router.get('/:movieId/average', handlers.getReviewAverage(client));

  return router;
};

