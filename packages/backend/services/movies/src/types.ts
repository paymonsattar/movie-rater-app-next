import { createClient } from 'redis';

export interface Movie {
  id: string;
  moviePoster?: string;
  title: string;
  genre: string;
  releaseDate: string;
}

export type RedisClient = ReturnType<typeof createClient>;
