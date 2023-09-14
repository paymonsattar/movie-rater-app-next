import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchAllMovies } from '../../app/store';
import MovieCard from './MovieCard';

const MovieCardList = () => {
  const dispatch: AppDispatch = useDispatch();
  const allMovies = useSelector((state: RootState) => state.movies.items);
  const filteredMovies = useSelector((state: RootState) => state.movies.filteredItems);
  const searchTerm = useSelector((state: RootState) => state.movies.searchTerm);  // get the searchTerm from Redux state
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

  if (filteredMovies.length === 0 && allMovies.length > 0 && searchTerm) {
    return <div>No movies found matching your search criteria.</div>;
  }

  const moviesToDisplay = filteredMovies.length ? filteredMovies : allMovies;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {moviesToDisplay.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieCardList;
