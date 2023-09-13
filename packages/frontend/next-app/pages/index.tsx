import React from 'react';
import Head from 'next/head';
import Layout from '../app/layout';
import MovieCardList from '../components/movies/MovieList';

const IndexPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 dark:bg-gray-800">
        <Head>
          <title>Movie List</title>
        </Head>

        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mt-8 mb-8 dark:text-white">
          Movies
        </h1>

        <MovieCardList />
      </div>
    </Layout>
  );
};

export default IndexPage;
