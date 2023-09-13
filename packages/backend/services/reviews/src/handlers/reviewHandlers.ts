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
  Review,
} from '@movie-rater/backend-common';

export const addReview =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const { movieId, rating, comment } = req.body;

    if (!movieId || rating === undefined || !comment) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('movieId, rating, and comment are required fields')
      );
    }

    if (typeof movieId !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid movieId format')
      );
    }

    const id = uuidv4();
    const reviewData: Review = {
      id,
      movieId,
      rating,
      comment,
    };

    try {
      await client.RPUSH(`reviews:${movieId}`, JSON.stringify(reviewData));
      return sendHttpResponse(
        res,
        CREATED_RESPONSE({ message: 'Review added', review: reviewData })
      );
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE(error.message)
      );
    }
  };

export const getReviews =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const { movieId } = req.params;

    if (typeof movieId !== 'string' && typeof movieId !== 'number') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid movieId format')
      );
    }

    try {
      const reply = await client.LRANGE(`reviews:${movieId}`, 0, -1);

      if (!reply || reply.length === 0) {
        return sendHttpResponse(
          res,
          NOT_FOUND_RESPONSE('No reviews found for this movieId')
        );
      }

      const reviews: Review[] = reply.map(review => JSON.parse(review));
      return sendHttpResponse(res, OK_RESPONSE({ reviews }));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE(error.message)
      );
    }
  };

export const getReviewAverage =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
    const { movieId } = req.params;

    try {
      const reply = await client.LRANGE(`reviews:${movieId}`, 0, -1);

      if (!reply || reply.length === 0) {
        return sendHttpResponse(
          res,
          NOT_FOUND_RESPONSE('No reviews found for this movieId')
        );
      }

      const reviews = reply.map(review => {
        const parsedReview = JSON.parse(review);

        return parsedReview.rating;
      });

      const total = reviews.reduce((acc, val) => acc + val, 0);
      const average = total / reviews.length || 0;
      const roundedAverage = Math.round(average * 10) / 10;

      return sendHttpResponse(res, OK_RESPONSE({ average: roundedAverage }));
    } catch (error) {
      return sendHttpResponse(
        res,
        INTERNAL_SERVER_ERROR_RESPONSE(error.message)
      );
    }
  };
