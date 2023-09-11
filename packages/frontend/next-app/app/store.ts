import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Movie } from './types';

const movies: Movie[] = []
const selectedMovie: Movie = {
  id: 0,
  title: '',
  description: '',
  genres: [''],
  releaseDate: '',
  averageRating: 0,
  posterUrl: '',
}

// Movie Slice
const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    movies,
    selectedMovie,
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
  },
});

export const { setMovies, setSelectedMovie } = movieSlice.actions;

// Store Configuration
const store = configureStore({
  reducer: {
    movie: movieSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
