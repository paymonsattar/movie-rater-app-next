import {
  createSlice,
  createAsyncThunk,
  configureStore,
  ThunkAction,
  Action
} from '@reduxjs/toolkit';
import { getAllMovies, IResponse } from '../app/api/movies';
import { Movie } from './types';

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
