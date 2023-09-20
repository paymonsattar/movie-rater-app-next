import { Request, Response } from 'express';
import redis from 'redis-mock';
import {
  createMovie,
  getMovieById,
  getAllMovies,
} from '../../movies/src/handlers/movieHandlers';
import { RedisClient } from '../src/redisClient';

jest.mock('redis', () => redis);

// 👇️ Mocking the Response object
const mockResponse = () => {
  const res: jest.Mocked<Response> = {
    status: jest.fn().mockReturnThis() as any,
    json: jest.fn().mockReturnThis() as any,
  } as any;
  return res;
};

// 👇️ Mocking the Request object
const mockRequest = (body: object, params: object): Request => {
  return {
    body,
    params,
  } as Request;
};

describe('Movies API handlers tests', () => {
  let req: Request;
  let res: jest.Mocked<Response>;
  let mockRedisClient: ReturnType<typeof redis.createClient>;
  let redisClient: RedisClient;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    mockRedisClient = redis.createClient();

    // 🧠 Using redis-mock to simulate Redis operations in a testing environment.
    // This allows for isolated unit tests without affecting a real Redis instance.
    //
    // 🧠 Type assertion is used here to align the Redis client types between the main application
    // and the testing environment. This is necessary due to version differences between 'redis'
    // and the redis that 'redis-mock' relies upon.
    redisClient = mockRedisClient as unknown as RedisClient;
  });

  describe('createMovie', () => {
    const mockMovie = {
      title: 'Movie1',
      genres: ['Action', 'Crime'],
      description: 'A movie description',
      director: 'John Doe',
      runtime: 44,
      releaseDate: '2022-09-05',
      actors: ['actorA', 'actorB', 'actorC'],
      moviePoster: 'url',
    }

    it('should successfully create a movie', async () => {
      mockRedisClient.HSET = jest.fn().mockResolvedValue(1);
      mockRedisClient.RPUSH = jest.fn().mockResolvedValue(1);

      req = mockRequest(mockMovie, {});

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        status: "success",
        body: expect.objectContaining({
          ...mockMovie,
          id: expect.any(String),
        }),
      });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.HSET = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest(mockMovie, {});

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Error creating movie',
        status: 'error',
      });
    });

    it('should return 400 if title is missing', async () => {
      req = mockRequest(
        { ...mockMovie, title: null },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'title, description, genres, and releaseDate are required fields',
        status: 'error',
      });
    });

    it('should return 400 if genre is missing', async () => {
      req = mockRequest(
        { ...mockMovie, genres: [] },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'title, description, genres, and releaseDate are required fields',
        status: 'error',
      });
    });

    it('should return 400 if releaseDate is missing', async () => {
      req = mockRequest(
        { ...mockMovie, releaseDate: null },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'title, description, genres, and releaseDate are required fields',
        status: 'error',
      });
    });

    it('should return 400 for invalid title format', async () => {
      req = mockRequest(
        { ...mockMovie, title: {}},
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid data type: title must be a string',
        status: 'error',
      });
    });

    it('should return 400 for invalid genres format', async () => {
      req = mockRequest(
        { ...mockMovie, genres: {}},
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid data type: genres must be an array',
        status: 'error',
      });
    });

    it('should return 400 for invalid releaseDate format', async () => {
      req = mockRequest(
        { ...mockMovie, releaseDate: {} },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid data type: releaseDate must be a string',
        status: 'error',
      });
    });

    it('should return 400 for invalid moviePoster format', async () => {
      req = mockRequest(
        { ...mockMovie, moviePoster: {} },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid data type: moviePoster must be a string',
        status: 'error',
      });
    });
  });

  describe('getAllMovies', () => {
    it('should successfully get all movies', async () => {
      // 👇️ Mocking the Redis LRANGE function to return a list of movies
      mockRedisClient.LRANGE = jest
        .fn()
        .mockResolvedValue([
          '{"id": "1", "title": "Movie1"}',
          '{"id": "2", "title": "Movie2"}',
        ]);

      // 👇️ No parameters needed for this request
      req = mockRequest({}, {});

      await getAllMovies(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        body: [
          { id: '1', title: 'Movie1', averageRating: 0 },
          { id: '2', title: 'Movie2', averageRating: 0 },
        ],
        status: 'success',
      });
    });

    it('should return 500 if an error occurs', async () => {
      // 👇️ Mocking a Redis error
      mockRedisClient.LRANGE = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest({}, {});

      await getAllMovies(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Error fetching movies',
        status: 'error',
      });
    });

    it('should return 404 if no movies are found', async () => {
      // 👇️ Mocking the Redis LRANGE function to return null
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(null);

      req = mockRequest({}, {});

      await getAllMovies(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        message: 'No movies found',
        status: 'error',
      });
    });
  });

  describe('getMovieById', () => {
    it('should successfully get a movie by ID', async () => {
      // 👇️ Mocking Redis HGETALL function to return a movie
      mockRedisClient.HGETALL = jest.fn().mockResolvedValue({
        id: '1',
        title: 'Movie1',
        genre: 'Action',
        releaseDate: '2022-09-05',
        moviePoster: 'url',
      });

      req = mockRequest({}, { id: '1' });

      await getMovieById(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        body: {
          id: '1',
          title: 'Movie1',
          genre: 'Action',
          releaseDate: '2022-09-05',
          moviePoster: 'url',
          averageRating: 0,
        },
        status: 'success',
      });
    });

    it('should return 500 if an error occurs', async () => {
      // Mocking a Redis error
      mockRedisClient.HGETALL = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest({}, { id: '1' });

      await getMovieById(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Error fetching movie',
        status: 'error',
      });
    });

    it('should return 404 for a nonexistent movie ID', async () => {
      // 👇️ Mocking the Redis HGETALL function to return null
      mockRedisClient.HGETALL = jest.fn().mockResolvedValue(null);

      req = mockRequest({}, { id: 'nonexistent' });

      await getMovieById(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        message: 'Movie not found',
        status: 'error',
      });
    });

    it('should return 400 for an invalid movie ID format', async () => {
      req = mockRequest({}, { id: {} });

      await getMovieById(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid movie ID format',
        status: 'error',
      });
    });
  });
});
