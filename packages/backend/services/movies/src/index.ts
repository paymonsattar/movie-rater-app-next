import cors from 'cors';
import express from 'express';
import { createClient } from 'redis';
import { createMovieRoutes } from './routes/movie';
import { populateMovies } from './utils/populateMovies';

/**
 * 📚 Main server file for the Movie API.
 *
 * This module initialises the Express server and sets up routes for managing movies.
 * It also initialises a Redis client to serve as a fast, in-memory data store for the movies.
 *
 * @module MainServer
 */

// 🧠 Initialising Redis client to serve as a fast, in-memory data store for movies.
// Chose Redis due to its high performance and support for list data structures.
const client = createClient();

// 🎯 TODO: Add reconnect logic for Redis client
client.on('error', err => {
  console.error(`Error connecting to Redis: ${err}`);
});

// 👇️ Main function to initialize the server and its routes
const initialise = async () => {
  await client.connect();

  const app = express();
  const port = 3000;

  // 👇️ Enabling CORS for localhost ports 4200 and 3000.
  //
  // Port 4200: Next.js frontend
  // Port 3000: Movies REST API
  app.use(
    cors({
      origin: 'http://localhost:4200',
    })
  );

  app.use(express.json());
  app.use('/movies/', createMovieRoutes(client));

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  const movieCount = await client.LLEN('allMovies');
  // 👇️ Check if the Redis database is empty and populate it if necessary.
  //
  // 🧠 We use a json file with multiple movies - sort of as a seeder or providing
  // default movie data. This checks if the Redis database is empty and populates
  // it with default movie data if necessary.
  if (movieCount === 0) {
    console.log('Populating Redis database with movies...');
    await populateMovies(client);
  }
};

initialise().catch(error => {
  console.error('Failed to initialize server:', error);
});
