import React, { useState } from 'react';
import { Movie, Review } from '../../app/types';
import { addReview } from '../../app/api/reviews';

interface RatingProps {
  movie: Movie;
  onRatingSubmit: () => Promise<void>;
}

const Rating = ({ movie, onRatingSubmit }: RatingProps) => {
  const DEFAULT_RATING = 1;  // Changed to 0 so that no star is highlighted by default
  const DEFAULT_COMMENT = '';

  const [hoverRating, setHoverRating] = useState(DEFAULT_RATING);
  const [selectedRating, setSelectedRating] = useState(DEFAULT_RATING);
  const [comment, setComment] = useState(DEFAULT_COMMENT);

  const getStarColor = (index: number) => {
    if (index <= selectedRating) {
      return 'text-yellow-300';
    }
    if (index <= hoverRating) {
      return 'text-yellow-500';
    }
    return 'text-gray-200';
  };

  const handleMouseOver = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(DEFAULT_RATING);
  };

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async () => {
    const newReview: Review = {
      movieId: movie.id,
      rating: selectedRating,
      comment,
    };

    await addReview(newReview);
    await onRatingSubmit();

    setSelectedRating(DEFAULT_RATING);
    setComment(DEFAULT_COMMENT);
  };

  const handleReset = () => {
    setSelectedRating(DEFAULT_RATING);
    setComment(DEFAULT_COMMENT);
  };

  return (
    <div className="flex flex-col items-left">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(index => (
          <svg
          key={index}
          className={`w-8 h-8 cursor-pointer ${getStarColor(index)} mx-1`}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          className="w-full p-2 rounded border text-black"
          placeholder="Write your review here..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      <div className="mt-4"></div>
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
        >
          Submit
        </button>
        <button
          onClick={handleReset}
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Rating;
