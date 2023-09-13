import { Review } from '../types';
import { httpRequest } from '../utils/apiUtil';

const baseUrl = 'http://localhost:3002/reviews';

// TODO move this to frontend-common
export interface IResponse {
  status: string;
  code: number;
  body?: any;
  message?: string;
}

/**
 * Add a new review.
 * @param newReview - The new review object.
 */
export const addReview = async (newReview: Review): Promise<Review> => {
  const response = await httpRequest<IResponse>(
    'POST',
    `${baseUrl}/`,
    newReview
  );

  // TODO Replace with logger
  console.log('HTTP Response:', response);

  return response.body as Review;
};

/**
 * Fetch all reviews for a specific movie by its ID.
 * @param movieId - The ID of the movie.
 */
export const getReviews = async (movieId: string): Promise<Review[]> => {
  const response = await httpRequest<IResponse>('GET', `${baseUrl}/${movieId}`);

  // TODO Replace with logger
  console.log('HTTP Response:', response);

  return response.body as Review[];
};

/**
 * Fetch the average review for a specific movie by its ID.
 * @param movieId - The ID of the movie.
 */
export const getReviewAverage = async (movieId: string): Promise<number> => {
  const response = await httpRequest<IResponse>('GET', `${baseUrl}/${movieId}`);

  // TODO Replace with logger
  console.log('HTTP Response:', response);

  return response.body as number;
};
