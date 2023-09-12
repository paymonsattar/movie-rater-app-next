import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Movie } from '../app/types';
import MovieCard from '../components/movies/MovieCard';
import Layout from '../app/layout'
import { getAllMovies } from '../app/api/movies';

const IndexPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const MovieList = () => {
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const fetchedMovies = await getAllMovies();
          setMovies(fetchedMovies);
        } catch (error) {
          console.error(error);
        }
      };
      
      fetchMovies();
    }, []);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 dark:bg-gray-800">
        <Head>
          <title>Movie List</title>
        </Head>

        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mt-8 mb-8 dark:text-white">
          Movies
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MovieList/>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
