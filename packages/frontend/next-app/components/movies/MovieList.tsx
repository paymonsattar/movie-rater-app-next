import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState, setSelectedGenres, setReviewRatingRange, searchMovies } from '../../app/store';
import { fetchAllMovies } from '../../app/store';
import MovieCard from './MovieCard';
import { MOVIE_GENRES } from '../../app/consts';
import { Movie } from '../../app/types';

const MovieCardList = () => {
  const dispatch: AppDispatch = useDispatch();

  const allMovies = useSelector((state: RootState) => state.movies.items);
  const filteredMovies = useSelector((state: RootState) => state.movies.filteredItems);
  const searchTerm = useSelector((state: RootState) => state.movies.searchTerm);
  const status = useSelector((state: RootState) => state.movies.status);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllMovies());
    }
  }, [status, dispatch]);

  const handleGenreChange = (genre: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading movies.</div>;
  }

  if (filteredMovies.length === 0 && allMovies.length > 0 && searchTerm) {
    return <div>No movies found matching your search criteria.</div>;
  }

  const moviesToDisplay = filteredMovies.length ? filteredMovies : allMovies;
  

  const filterMoviesByGenre = (movies: Movie[]): Movie[] => {
    if (selectedGenres.length === 0) {
      return movies;
    }
  
    return movies.filter(movie => {
      return movie.genres.some(genre => selectedGenres.includes(genre));
    });
  };
  

  return (
    <>
      <div className="flex items-center justify-center p-4 relative">
  <button 
    id="dropdownDefault" 
    data-dropdown-toggle="dropdown"
    onClick={toggleDropdown}
    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
  >
    Filter by Genre
    <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>

  {dropdownVisible && (
    <div 
      id="dropdown" 
      className="z-20 absolute top-full w-56 -mt-2 p-3 bg-white rounded-lg shadow-xl dark:bg-blue-600"
    >
      <h6 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
        Genres
      </h6>
      <ul className="space-y-2 text-md" aria-labelledby="dropdownDefault">
        {Object.keys(MOVIE_GENRES).map(genreKey => (
          <li className="flex items-center" key={genreKey}>
            <input
              id={genreKey}
              type="checkbox"
              checked={selectedGenres.includes(MOVIE_GENRES[genreKey as keyof typeof MOVIE_GENRES])}
              onChange={(e) => handleGenreChange(MOVIE_GENRES[genreKey as keyof typeof MOVIE_GENRES], e.target.checked)}
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label htmlFor={genreKey} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {MOVIE_GENRES[genreKey as keyof typeof MOVIE_GENRES]}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterMoviesByGenre(moviesToDisplay).map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

export default MovieCardList;
