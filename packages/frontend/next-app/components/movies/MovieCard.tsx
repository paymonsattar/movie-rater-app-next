import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextImage from 'next/image';
import Link from 'next/link';
import { Movie } from '../../app/types';
import { PLACEHOLDER_IMAGE } from '../../app/consts';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const router = useRouter();
  const { id, title, moviePoster, genres, description, averageRating } = movie;
  const [currentImage, setCurrentImage] = useState(moviePoster);

  useEffect(() => {
    const img = new Image();
    img.src = moviePoster;
    img.onload = () => setCurrentImage(moviePoster);
    img.onerror = () => setCurrentImage(PLACEHOLDER_IMAGE);
  }, [moviePoster]);

  const goToMovieDetails = () => {
    router.push(`/movie/${id}`);
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className="w-6 h-6 mr-1"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 20"
    >
      <path
        data-testid="star"
        fill={index + 1 <= averageRating ? '#FBBF24' : '#E5E7EB'} // Corresponds to Tailwind's yellow-300 and gray-200
        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
      />
    </svg>
  ));

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
      <div className="relative flex justify-center">
        <div className="absolute left-0 w-full h-8 bg-blue-700 transform rounded-t-lg"></div>
        <h5 className="relative z-10 px-8 py-2 text-xl font-semibold tracking-tight text-white bg-blue-700 rounded-md">
          {title}
        </h5>
      </div>
      <div className="flex justify-center mt-2">
        <Link href={`/movie/${id}`}>
          <NextImage
            className="rounded-md"
            src={currentImage}
            alt={`${title} poster`}
            width={280}
            height={420}
          />
        </Link>
      </div>
      <div className="px-5 pb-5">
        <div className="flex flex-wrap mt-2 mb-2">
          {genres.map((genre, index) => (
            <span
              key={index}
              className="m-1 p-2 rounded-lg bg-gray-600 text-white text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
        <div className="flex items-center mt-2.5 mb-2">
          <div className="flex items-center">{stars}</div>
          <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
            {averageRating}/5
          </span>
        </div>
        <p className="my-2 text-gray-700 dark:text-gray-400">
          {description.substring(0, 100)}...
        </p>
        <button
          onClick={goToMovieDetails}
          className="w-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-4 text-center dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          More Info
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
