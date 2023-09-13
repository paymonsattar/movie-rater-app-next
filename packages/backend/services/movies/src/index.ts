// main server file
import cors from 'cors';
import express from 'express';
import { createClient } from 'redis';
import { createMovieRoutes } from './routes/movie';
import { populateMovies } from './utils/populateMovies';  // adjust the import path as needed

const client = createClient();

client.on('error', err => {
  console.error(`Error connecting to Redis: ${err}`);
});

const initialise = async () => {
  await client.connect();

  const app = express();
  const port = 3000;

  app.use(cors({
    origin: 'http://localhost:4200'
  }));

  app.use(express.json());
  app.use('/movies/', createMovieRoutes(client));

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  // Check if the Redis database is empty and populate it if necessary
  const movieCount = await client.LLEN('allMovies');

  if (movieCount === 0) {
    console.log('Populating Redis database with movies...');
    await populateMovies(client);
  }
};

initialise().catch(error => {
  console.error('Failed to initialize server:', error);
});
