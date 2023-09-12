import { Movie } from '../types';
import { httpRequest } from '../utils/apiUtil';

const baseUrl = 'http://localhost:3000/movies';

/**
 * Fetch all movies from the API.
 */
export const getAllMovies = async (): Promise<Movie[]> => {
  return httpRequest<Movie[]>('GET', `${baseUrl}/`);
};

/**
 * Fetch a single movie by ID from the API.
 * @param id - The ID of the movie.
 */
export const getMovie = async (id: string): Promise<Movie> => {
  return httpRequest<Movie>('GET', `${baseUrl}/${id}`);
};

/**
 * Create a new movie.
 * @param newMovie - The new movie object.
 */
export const createMovie = async (newMovie: Movie): Promise<Movie> => {
  return httpRequest<Movie>('POST', `${baseUrl}/`, newMovie);
};
