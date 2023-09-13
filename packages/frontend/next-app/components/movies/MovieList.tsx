import React, { useEffect, useState } from 'react';
import { Movie } from '../../app/types';
import MovieCard from '../../components/movies/MovieCard';
import { getAllMovies } from '../../app/api/movies';

const MovieCardList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await getAllMovies();

        setMovies(fetchedMovies);
      } catch (error) {
        console.error('error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieCardList;
