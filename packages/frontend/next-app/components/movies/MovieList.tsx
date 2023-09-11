import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../../app/types';

interface MovieCardListProps {
  movies: Movie[];
}

const MovieCardList: React.FC<MovieCardListProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 dark:bg-gray-900">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieCardList;