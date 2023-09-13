import React from 'react';
import { Movie } from '../../app/types';
import { defaultImagePlaceholder } from '../../app/utils/placeholders';

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail = ({ movie }: MovieDetailProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4">
      <img
          className="p-8 rounded-t-lg"
          src={movie.moviePoster}
          alt={`${movie.title} poster`}
          onError={defaultImagePlaceholder}
        />
      <div className="px-5 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-4">{movie.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{movie.genres.join(', ')}</p>
        <p className="text-gray-700 dark:text-gray-300 mt-4">{movie.description}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4"><strong>Release Date:</strong> {movie.releaseDate}</p>
        <div className="flex items-center mt-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-3">Average rating: {movie.averageRating}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
