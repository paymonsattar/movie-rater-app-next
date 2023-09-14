import {
  createSlice,
  createAsyncThunk,
  configureStore,
  ThunkAction,
  Action
} from '@reduxjs/toolkit';
import { getAllMovies, IResponse } from '../app/api/movies';
import { Movie } from './types';
import { MOVIE_GENRES } from './consts';

interface ReviewRatingRange {
  min: number;
  max: number;
}

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

export const searchMovies = (term: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setSearchTerm(term));

  const allMovies = getState().movies.items;
  const filteredMovies = allMovies.filter(
    movie => 
      movie.title.toLowerCase().includes(term.toLowerCase())
  );

  dispatch(setFilteredMovies(filteredMovies));
};

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    items: [] as Movie[],
    filteredItems: [] as Movie[],
    status: 'idle',
    searchTerm: '' as string,
    selectedGenres: [] as MOVIE_GENRES[],
    reviewRatingRange: { min: 0, max: 10 } as ReviewRatingRange,
    error: null as string | null,
  },
  reducers: {
    setFilteredMovies: (state, action) => {
      state.filteredItems = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedGenres: (state, action) => {
      state.selectedGenres = action.payload;
    },
    setReviewRatingRange: (state, action) => {
      state.reviewRatingRange = action.payload;
    },
  },
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

export const { setFilteredMovies, setSearchTerm, setSelectedGenres, setReviewRatingRange } = movieSlice.actions;

// Create the store
const store = configureStore({
  reducer: {
    movies: movieSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;
