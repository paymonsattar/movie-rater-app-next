import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AppDispatch, RootState } from '../../app/store';
import { searchMovies } from '../../app/store';

const NavBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchTerm = useSelector((state: RootState) => state.movies.searchTerm); // getting searchTerm from Redux

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    dispatch(searchMovies(newSearchTerm));
  };

  return (
    <header className="bg-blue-900 fixed top-0 w-full z-50 shadow-md">
      <nav className="container mx-auto px-6 py-2">
        <div className="flex justify-between items-center">
          <div
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => router.push('/')}
          >
            MovieRater
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-white rounded-md px-3 py-2 focus:outline-none focus:border-blue-300 w-full text-black md:w-auto"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
