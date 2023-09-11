import React from 'react';
import { useRouter } from 'next/router';
import { Movie } from '../../app/types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();  // Use the useRouter hook
  const { id, title, posterUrl, genres, description, averageRating } = movie;

  // Function to handle button click
  const handleMoreInfoClick = () => {
    router.push(`/movie/${id}`);
  };

  // Create an array with 'averageRating' number of full stars
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg key={index} className={`w-4 h-4 ${index < averageRating ? 'text-yellow-300' : 'text-gray-200'} mr-1`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
  ));

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="p-8 rounded-t-lg" src={posterUrl} alt={`${title} poster`} />
      </a>
      <div className="px-5 pb-5">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </a>
        <p className="mt-2 text-gray-700 dark:text-gray-400">{genres.join(", ")}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-400">{description.substring(0, 50)}...</p>
        <div className="flex items-center mt-2.5 mb-5">
          {stars}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">Rating: {averageRating}/5</span>
          <button onClick={handleMoreInfoClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
