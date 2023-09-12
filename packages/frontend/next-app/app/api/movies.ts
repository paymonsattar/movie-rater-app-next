import axios from 'axios';

const baseUrl = 'http://localhost:3000/movies';

// Interface to type the Movie
export interface Movie {
  id?: string;
  title: string;
  genre: string;
  // ... any other fields
}

/**
 * Fetch all movies from the API.
 */
export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get<Movie[]>(`${baseUrl}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching movies');
  }
};

/**
 * Fetch a single movie by ID from the API.
 * @param id - The ID of the movie.
 */
export const getMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await axios.get<Movie>(`${baseUrl}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching the movie');
  }
};

/**
 * Create a new movie.
 * @param newMovie - The new movie object.
 */
export const createMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await axios.post<Movie>(`${baseUrl}/`, newMovie);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while creating the movie');
  }
};
