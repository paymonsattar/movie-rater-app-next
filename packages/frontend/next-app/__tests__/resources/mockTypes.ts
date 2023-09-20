import { Movie, Review } from '../../app/types';

export const mockMovie: Movie = {
  id: 'test-movie-id',
  title: 'Mock Movie Title',
  moviePoster: '/mock_movie_picture.webp',
  runtime: 0,
  director: 'Paymon',
  releaseDate: '1994',
  actors: 'Paul Smith, Mendy Noon',
  genres: ['Action', 'Adventure', 'Sci-Fi'],
  description: "Mock movie description that's long enough to be truncated.",
  averageRating: 3.2,
};

export const mockReview: Review = {
  movieId: 'test-movie-id',
  rating: 1,
  comment: '',
};

export const nockCORSHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'origin, x-requested-with',
};
