import { httpRequest } from '../utils/apiUtil';

const baseUrl = 'http://localhost:3002/reviews';

export interface Review {
  movieId: string;
  review: number;
}

/**
 * Add a new review.
 * @param newReview - The new review object.
 */
export const addReview = async (newReview: Review): Promise<Review> => {
  return httpRequest<Review>('POST', `${baseUrl}/`, newReview);
};

/**
 * Fetch all reviews for a specific movie by its ID.
 * @param movieId - The ID of the movie.
 */
export const getReviews = async (movieId: string): Promise<Review[]> => {
  return httpRequest<Review[]>('GET', `${baseUrl}/${movieId}`);
};

/**
 * Fetch the average review for a specific movie by its ID.
 * @param movieId - The ID of the movie.
 */
export const getReviewAverage = async (movieId: string): Promise<number> => {
  return httpRequest<number>('GET', `${baseUrl}/${movieId}`);
};
