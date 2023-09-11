// pages/index.tsx
import { Movie } from '../app/types';
import MovieCard from '../components/movies/MovieCard';
import Layout from '../app/layout'
import Head from 'next/head';

const dummyData: Movie[] = [
  {
    id: 1,
    title: 'Ocean of Mystery',
    description: 'A deep sea diver finds more than he bargained for in this underwater thriller.',
    genres: ['Action', 'Thriller'],
    releaseDate: '2023-01-15',
    averageRating: 4,
    posterUrl: 'https://placekitten.com/200/300'
  },
  {
    id: 2,
    title: 'Moonwalk Heist',
    description: 'A group of astronauts plan a daring robbery on the International Space Station.',
    genres: ['Action', 'Sci-Fi'],
    releaseDate: '2023-04-10',
    averageRating: 4.5,
    posterUrl: 'https://placekitten.com/200/301'
  },
  {
    id: 3,
    title: 'Code Red: Hospital',
    description: 'A virus outbreak puts a hospital under lockdown.',
    genres: ['Drama', 'Thriller'],
    releaseDate: '2022-11-11',
    averageRating: 3,
    posterUrl: 'https://placekitten.com/200/302'
  },
  {
    id: 4,
    title: 'The Time Loop',
    description: 'A physicist gets stuck in a time loop and must find a way to escape.',
    genres: ['Sci-Fi', 'Drama'],
    releaseDate: '2023-09-19',
    averageRating: 3.5,
    posterUrl: 'https://placekitten.com/200/303'
  },
  {
    id: 5,
    title: 'Alien Forest',
    description: 'Explorers discover a mysterious forest with otherworldly secrets.',
    genres: ['Adventure', 'Fantasy'],
    releaseDate: '2023-05-20',
    averageRating: 4.7,
    posterUrl: 'https://placekitten.com/200/304'
  },
  {
    id: 6,
    title: 'Robot Rebellion',
    description: 'The world of robotics takes a dark turn when the robots start to rebel against humans.',
    genres: ['Action', 'Sci-Fi'],
    releaseDate: '2023-02-01',
    averageRating: 4,
    posterUrl: 'https://placekitten.com/200/305'
  },
  {
    id: 7,
    title: 'Lost in Memories',
    description: 'A detective must solve a case by diving into people\'s memories.',
    genres: ['Mystery', 'Thriller'],
    releaseDate: '2023-08-15',
    averageRating: 4.2,
    posterUrl: 'https://placekitten.com/200/306'
  },
  {
    id: 8,
    title: 'Invisible War',
    description: 'A journalist uncovers a secret war fought with invisible technology.',
    genres: ['Action', 'Thriller'],
    releaseDate: '2023-07-04',
    averageRating: 2.9,
    posterUrl: 'https://placekitten.com/200/307'
  },
  {
    id: 9,
    title: 'Island of Secrets',
    description: 'A family trip takes a turn when they discover the island they are on has a secret society.',
    genres: ['Drama', 'Mystery'],
    releaseDate: '2022-12-25',
    averageRating: 3.8,
    posterUrl: 'https://placekitten.com/200/308'
  },
  {
    id: 10,
    title: 'Skyfall Pirates',
    description: 'Pirates in a futuristic world fight for control of floating islands.',
    genres: ['Action', 'Adventure'],
    releaseDate: '2023-11-20',
    averageRating: 4.1,
    posterUrl: 'https://placekitten.com/200/309'
  }
];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyData.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
