import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Movie } from '../../app/types';
import { PLACEHOLDER_IMAGE } from '../../app/consts';
import RatingComponent from './RatingComponent';

interface MovieDetailProps {
  movie: Movie;
  onRatingSubmit: () => Promise<void>;
}

const MovieDetail = ({ movie, onRatingSubmit }: MovieDetailProps) => {
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

  const fetchMovie = async () => {
    await onRatingSubmit();
  };

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-gray-800 p-8">
      <div className="mt-4 flex flex-col md:flex-row md:space-x-12 w-full items-center">
        <div className="flex justify-center">
          <NextImage
            className="rounded-lg"
            src={currentImage}
            alt={`${title} poster`}
            width={420}
            height={630}
          />
        </div>
        <div className="flex flex-col w-full h-full md:max-w-xl mt-8 md:mt-0">
          <div className="relative flex justify-center w-full">
            <div className="absolute left-0 top-0 w-full h-12 bg-blue-900 transform rounded-t-lg"></div>
            <h1 className="relative z-10 px-8 py-2 text-3xl font-semibold tracking-tight text-white bg-blue-900 rounded-md">
              {title}
            </h1>
          </div>
          <div className="flex flex-wrap mb-4">
            {genres.map((genre, index) => (
              <span
                key={index}
                className="m-1 p-2 rounded-lg bg-gray-600 text-white text-md"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-justify text-lg text-gray-700 dark:text-gray-300 mb-4">
            {description}
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            <strong>Release Date:</strong> {releaseDate}
          </p>

          <div className="flex items-left">
            <span className="bg-blue-100 text-blue-800 text-md font-semibold px-4 py-2 rounded">
              Average rating: {averageRating}
            </span>
          </div>

          <div className="mt-8">
            <RatingComponent movie={movie} onRatingSubmit={fetchMovie} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
