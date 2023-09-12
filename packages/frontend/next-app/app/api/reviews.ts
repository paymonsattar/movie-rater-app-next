import axios from 'axios';

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
  try {
    const response = await axios.post<Review>(`${baseUrl}/`, newReview);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while adding the review');
  }
};

/**
 * Fetch all reviews for a specific movie by its ID.
 * @param movieId - The ID of the movie.
 */
export const getReviews = async (movieId: string): Promise<Review[]> => {
  try {
    const response = await axios.get<Review[]>(`${baseUrl}/${movieId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching the reviews');
  }
};

/**
 * Fetch the average review for a specific movie by its ID.
 * @param movieId - The ID of the movie.
 */
export const getReviewAverage = async (movieId: string): Promise<number> => {
  try {
    const response = await axios.get<number>(`${baseUrl}/${movieId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching the review average');
  }
};
