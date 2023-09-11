import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store'; // Replace './store' with the path to your store.ts

const SearchBar: React.FC = () => {
  const movies = useSelector((state: RootState) => state.movie.movies);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]); // Replace string[] with the type of your movie if necessary

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      const newSuggestions = movies.filter(movie => regex.test(movie.title)); // Assuming movies have a 'title' field
      setSuggestions(newSuggestions.map(movie => movie.title)); // Replace with the property you want to display
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        className="border rounded p-2 w-full"
        placeholder="Search for a movie..."
      />
      <ul className="absolute z-10 border border-gray-300 bg-white w-full text-left">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setSearchTerm(suggestion);
              setSuggestions([]);
            }}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
