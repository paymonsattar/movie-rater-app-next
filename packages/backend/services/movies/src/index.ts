import express from 'express';
import { createClient } from 'redis';
import { createMovieRoutes } from './routes/movie';

const client = createClient();

client.on('error', err => {
  console.error(`Error connecting to Redis: ${err}`);
});

const initialise = async () => {
  await client.connect();

  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use('/movies/', createMovieRoutes(client));

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

initialise().catch(error => {
  console.error('Failed to initialize server:', error);
});