import { Request, Response } from 'express';
import { RedisClient } from '../redisClient';
import { createMovie } from '../handlers/movieHandlers';
// 🧠 Had to directly import here as for some reason nx assets compilation wasn't working
import erikSytnykMoviesList from '../../erik-sytnyk-movies-list.json';

/**
 * 📚 Populates the Redis database with a list of movies.
 *
 * This function is designed to be a utility for seeding the database
 * with initial data. It uses the 'createMovie' handler to ensure that
 * movies are added in a manner consistent with how they would be added
 * via the API.
 *
 * @param client - The Redis client used to interact with the Redis database.
 */
export const populateMovies = async (client: RedisClient) => {
  try {
    const parsedMovies = erikSytnykMoviesList.movies;

    for (const movie of parsedMovies) {
      const movieData = {
        title: movie.title,
        description: movie.plot,
        genres: movie.genres,
        director: movie.director,
        runtime: movie.runtime,
        actors: movie.actors,
        releaseDate: movie.year,
        moviePoster: movie.posterUrl,
      };

      // 🧠 Mocking the request object to simulate an API call to 'createMovie'.
      // This allows us to reuse the 'createMovie' logic for adding movies,
      // ensuring that the movies are added to the database in the same way
      // they would be if added via the API.
      const mockRequest = {
        body: movieData,
      } as Request;

      const res = {
        status: function (statusCode: number) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data: any) {
          // 🎯 Do something with the data if needed
          // for now just returning it.
          return data;
        },
      } as unknown as Response;

      // 👇️ Invoking the 'createMovie' handler with the mock Request and Response objects.
      // This effectively adds each movie to the Redis database, leveraging the existing
      // logic in 'createMovie' to ensure consistency.
      await createMovie(client)(mockRequest, res);
    }
  } catch (err) {
    console.error('Error populating movies:', err);
  }
};
