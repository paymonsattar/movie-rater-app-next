import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Movie } from '../../app/types';
import { PLACEHOLDER_IMAGE } from '../../app/utils/placeholders';

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail = ({ movie }: MovieDetailProps) => {
  const {
    title,
    moviePoster,
    genres,
    releaseDate,
    description,
    averageRating,
  } = movie;

  const [currentImage, setCurrentImage] = useState(moviePoster);

  useEffect(() => {
    const img = new Image();

    img.src = moviePoster;
    img.onload = () => setCurrentImage(moviePoster);
    img.onerror = () => setCurrentImage(PLACEHOLDER_IMAGE);
  }, [moviePoster]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4">
      <NextImage
        className="rounded-t-lg"
        src={currentImage}
        alt={`${title} poster`}
        width={300}
        height={450}
      />
      <div className="px-5 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-4">
          {title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {genres.join(', ')}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-4">{description}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <strong>Release Date:</strong> {releaseDate}
        </p>
        <div className="flex items-center mt-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-3">
            Average rating: {averageRating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
