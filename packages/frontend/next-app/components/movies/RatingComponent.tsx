import React, { useState } from 'react';

interface RatingProps {
  submitRating: (rating: number) => void;  // Replace with your actual backend function
}

const Rating: React.FC<RatingProps> = ({ submitRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleMouseOver = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    submitRating(selectedRating);
  };

  const handleReset = () => {
    setSelectedRating(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <svg
            key={index}
            className={`w-8 h-8 cursor-pointer ${index <= (hoverRating || selectedRating) ? 'text-yellow-300' : 'text-gray-200'} mx-1`}
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
      <div className="mt-2">
        <span className="text-lg font-semibold">Current Rating: {selectedRating}</span>
      </div>
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
