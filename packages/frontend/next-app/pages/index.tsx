import React from 'react';
import Head from 'next/head';
import Layout from './layout';
import MovieCardList from '../components/movies/MovieList';

const IndexPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <Head>
          <title>Movie List</title>
        </Head>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mt-20 mb-8 dark:text-white">
          Movies
        </h1>

        <MovieCardList />
      </div>
    </Layout>
  );
};

export default IndexPage;
