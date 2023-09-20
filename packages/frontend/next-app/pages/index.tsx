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
        <div className="mt-24">
          <MovieCardList />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
