import {
  createSlice,
  createAsyncThunk,
  configureStore,
} from '@reduxjs/toolkit';
import { getAllMovies, IResponse } from '../app/api/movies';
import { getReviews } from '../app/api/reviews';
import { Movie, Review } from './types';

// Async Thunk for fetching all movies
export const fetchAllMovies = createAsyncThunk<
  Movie[],
  void,
  { rejectValue: IResponse }
>('movies/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const movies = await getAllMovies();
    return movies;
  } catch (err) {
    return rejectWithValue(err as IResponse);
  }
});

// Async Thunk for fetching all reviews for a specific movie
export const fetchAllReviews = createAsyncThunk<
  Review[],
  string,
  { rejectValue: IResponse }
>('reviews/fetchAll', async (movieId, { rejectWithValue }) => {
  try {
    const reviews = await getReviews(movieId);
    return reviews;
  } catch (err) {
    return rejectWithValue(err as IResponse);
  }
});

// Movie slice
const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    items: [] as Movie[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Could not fetch movies';
      });
  },
});

// Review slice
const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [] as Review[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllReviews.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Could not fetch reviews';
      });
  },
});

// Create the store
const store = configureStore({
  reducer: {
    movies: movieSlice.reducer,
    reviews: reviewSlice.reducer,
  },
});

export default store;
