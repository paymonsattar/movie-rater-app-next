import { Request, Response } from 'express';
import { RedisClient } from '../types';

export const addReview =
  (client: RedisClient) => async (req: Request, res: Response) => {
    const { movieId, review } = req.body;

    // Validation for missing or empty fields
    if (!movieId) {
      return res.status(400).json({ error: 'movieId is required' });
    }

    if (!review) {
      return res.status(400).json({ error: 'review is required' });
    }

    // Type validation for movieId and review
    if (typeof movieId !== 'string' && typeof movieId !== 'number') {
      return res.status(400).json({ error: 'Invalid movieId format' });
    }

    // Convert review to number for validation
    const reviewNumber = Number(review);
    if (isNaN(reviewNumber) || reviewNumber < 0 || reviewNumber > 5) {
      return res
        .status(400)
        .json({ error: 'Invalid review value, must be between 0 and 5' });
    }

    try {
      const reply = await client.RPUSH(
        `reviews:${movieId}`,
        reviewNumber.toString()
      );
      return res.status(201).json({ message: 'Review added', count: reply });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

export const getReviews =
  (client: RedisClient) => async (req: Request, res: Response) => {
    const { movieId } = req.params;

    // Validation for movieId
    if (typeof movieId !== 'string' && typeof movieId !== 'number') {
      return res.status(400).json({ error: 'Invalid movieId format' });
    }

    try {
      const reply = await client.LRANGE(`reviews:${movieId}`, 0, -1);

      if (!reply || reply.length === 0) {
        return res
          .status(404)
          .json({ error: 'No reviews found for this movieId' });
      }

      return res.status(200).json({ reviews: reply });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

export const getReviewAverage =
  (client: RedisClient) => async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
      const reply = await client.LRANGE(`reviews:${movieId}`, 0, -1);

      if (!reply || reply.length === 0) {
        return res
          .status(404)
          .json({ error: 'No reviews found for this movieId' });
      }

      const reviews = reply.map(Number);
      const total = reviews.reduce((acc, val) => acc + val, 0);
      const average = total / reviews.length || 0;

      return res.status(200).json({ average });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
