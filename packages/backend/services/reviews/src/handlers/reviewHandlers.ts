import { Request, Response } from 'express';
import { RedisClient } from '../types';
import {
  IResponse,
  sendHttpResponse,
  OK_RESPONSE,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
  CREATED_RESPONSE,
} from '@movie-rater/backend-common';

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
      
      return sendHttpResponse(res, CREATED_RESPONSE({ message: 'Review added', count: reply }));
    } catch (error) {
      return sendHttpResponse(res, INTERNAL_SERVER_ERROR_RESPONSE(error.message));
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
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('No reviews found for this movieId'));
      }

      return sendHttpResponse(res, OK_RESPONSE({ reviews: reply }));
    } catch (error) {
      return sendHttpResponse(res, INTERNAL_SERVER_ERROR_RESPONSE(error.message));
    }
  };

  export const getReviewAverage =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const { movieId } = req.params;

    try {
      const reply = await client.LRANGE(`reviews:${movieId}`, 0, -1);

      if (!reply || reply.length === 0) {
        return sendHttpResponse(res, NOT_FOUND_RESPONSE('No reviews found for this movieId'));
      }

      const reviews = reply.map(Number);
      const total = reviews.reduce((acc, val) => acc + val, 0);
      const average = total / reviews.length || 0;

      return sendHttpResponse(res, OK_RESPONSE({ average }));
    } catch (error) {
      return sendHttpResponse(res, INTERNAL_SERVER_ERROR_RESPONSE(error.message));
    }
  };

