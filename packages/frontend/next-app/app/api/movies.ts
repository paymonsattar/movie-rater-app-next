import { Movie } from '../types';
import { httpRequest } from '../utils/apiUtil';

const baseUrl = 'http://localhost:3000/movies';

// TODO move this to frontend-common
export interface IResponse {
  status: string;
  code: number;
  body?: any;
  message?: string;
}

/**
 * Fetch all movies from the API.
 */
export const getAllMovies = async (): Promise<Movie[]> => {
  const response = await httpRequest<IResponse>(
    'GET',
    `${baseUrl}/`,
  );

  // TODO Replace with logger
  console.log('HTTP Response:', response);

  return response.body as Movie[];
};

/**
 * Fetch a single movie by ID from the API.
 * @param id - The ID of the movie.
 */
export const getMovie = async (id: string): Promise<Movie> => {
  const response = await httpRequest<IResponse>(
    'GET',
    `${baseUrl}/${id}`,
  );

  // TODO Replace with logger
  console.log('HTTP Response:', response);

  return response.body as Movie;
};

/**
 * Create a new movie.
 * @param newMovie - The new movie object.
 */
export const createMovie = async (newMovie: Movie): Promise<Movie> => {
  const response = await httpRequest<IResponse>(
    'POST',
    `${baseUrl}/}`,
    newMovie,
  );

  // TODO Replace with logger
  console.log('HTTP Response:', response);

  return response.body as Movie;
};
