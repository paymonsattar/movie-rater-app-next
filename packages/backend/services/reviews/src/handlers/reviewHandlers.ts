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

/**
 * 📚 This module contains the handlers for managing movie reviews.
 * 
 * Each handler function is a higher-order function that takes a Redis client
 * and returns an Express middleware function. The handlers are responsible for
 * adding, fetching, and calculating the average rating of reviews for movies.
 * 
 * @module ReviewHandlers
 */

// 👇️ Handler for adding a new review
export const addReview =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
  // 🧠 Extracting necessary fields from the request body
  const { movieId, rating, comment } = req.body;

    // 👇️ Validation block for required fields
    if (!movieId || !rating) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('movieId and rating are required fields')
      );
    }

    // 🧠 Validating the type of movieId
    if (typeof movieId !== 'string') {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid movieId format')
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return sendHttpResponse(
        res,
        BAD_REQUEST_RESPONSE('Invalid review value, must be between 0 and 5')
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
    // 👇️ Using Redis lists to store reviews for each movie.
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

// 👇️ Handler for fetching reviews for a particular movie
export const getReviews =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
  const { movieId } = req.params;

  // 🧠 Validating the type of movieId
  if (typeof movieId !== 'string' && typeof movieId !== 'number') {
    return sendHttpResponse(
      res, // 🎯 TODO: Consider adding pagination for large sets of reviews
      BAD_REQUEST_RESPONSE('Invalid movieId format')
    );
  }

  try {
    // 👇️ Fetching reviews from Redis
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

// 👇️ Handler for fetching the average review rating for a particular movie
export const getReviewAverage =
  (client: RedisClient) => async (req: Request, res: Response<IResponse>) => {
  // 🧠 Extracting movieId from request parameters
  const { movieId } = req.params;

  try {
    // 👇️ Fetching reviews from Redis
    const reply = await client.LRANGE(`reviews:${movieId}`, 0, -1);

    // 🧠 Handling case where no reviews are found
    if (!reply || reply.length === 0) {
      return sendHttpResponse(
        res,
        NOT_FOUND_RESPONSE('No reviews found for this movieId')
      );
    }

    // 🧠 Calculating the average rating in the application layer.
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
