import cors from 'cors';
import express from 'express';
import { createClient } from 'redis';
import { createMovieReviewRoutes } from './routes/review';

/**
 * 📚 Main server file for the Movie Reviews API.
 *
 * This module initialises the Express server and sets up routes for managing movie reviews.
 * It also initialises a Redis client to serve as a fast, in-memory data store for the reviews.
 *
 * @module MainServer
 */

// 🧠 Initialising Redis client to serve as a fast, in-memory data store for movie reviews.
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
  const port = 3002;

  // 👇️ Enabling CORS for localhost ports 4200 and 3000.
  //
  // Port 4200: Next.js frontend
  // Port 3000: Movies REST API
  app.use(
    cors({
      origin: ['http://localhost:4200', 'http://localhost:3000'],
    })
  );

  app.use(express.json());

  // 👇️ Setting up routes for movie reviews
  app.use('/reviews/', createMovieReviewRoutes(client));

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

// 🎯 TODO: Add graceful shutdown for server and Redis client
initialise().catch(error => {
  console.error('Failed to initialise server:', error);
});
