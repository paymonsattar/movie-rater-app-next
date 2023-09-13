import { Request, Response } from 'express';
import { RedisClient } from '../redisClient';
import { createMovie } from '../handlers/movieHandlers';
// Had to directly import here as for some reason nx assets compilation wasn't working
import erikSytnykMoviesList from '../assets/erik-sytnyk-movies-list.json';

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

      // Create mock Request and Response
      const mockReq = {
        body: movieData,
      } as Request;

      const res = {
        status: function (statusCode: number) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data: any) {
          // Do something with the data if needed
          // for now just returning it.
          return data;
        },
      } as unknown as Response;

      await createMovie(client)(mockReq, res);
    }
  } catch (err) {
    console.error('Error populating movies:', err);
  }
};
