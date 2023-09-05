import { createClient } from 'redis';

export interface Review {
  movieId: string;
  review: number;
}

export interface AverageReview {
  movieId: string;
  averageReview: number;
}

export type RedisClient = ReturnType<typeof createClient>;
