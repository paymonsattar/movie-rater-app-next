import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { fetchAllMovies } from '../../app/store';
import { RootState } from '../../app/store';
import MovieCard from './MovieCard';

const MovieCardList = () => {
  const dispatch: AppDispatch = useDispatch();
  const movies = useSelector((state: RootState) => state.movies.items);
  const status = useSelector((state: RootState) => state.movies.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllMovies());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading movies.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieCardList;
