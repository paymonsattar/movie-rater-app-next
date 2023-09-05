import { Request, Response } from 'express';
import redis from 'redis-mock';
import {
  createMovie,
  getMovieById,
  getAllMovies,
} from '../../movies/src/handlers/movieHandlers'; // Replace with the actual module name
import { RedisClient } from '../../movies/src/types'; // Replace with the actual module name

jest.mock('redis', () => redis);

// Mocking the Response object
const mockResponse = () => {
  const res: jest.Mocked<Response> = {
    status: jest.fn().mockReturnThis() as any,
    json: jest.fn().mockReturnThis() as any,
  } as any;
  return res;
};

// Mocking the Request object
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

    // It seems like there is a type mismatch between the RedisClient from
    // 'redis-mock: v3.0.2' and the RedisClient from 'redis: v4.6.8'. For now asserting
    // the type here, as tests are running correctly.
    redisClient = mockRedisClient as unknown as RedisClient;
  });

  describe('createMovie', () => {
    const mockUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should successfully create a movie', async () => {
      mockRedisClient.HSET = jest.fn().mockResolvedValue(1);
      mockRedisClient.RPUSH = jest.fn().mockResolvedValue(1);

      req = mockRequest(
        {
          title: 'Movie1',
          genre: 'Action',
          releaseDate: '2022-09-05',
          moviePoster: 'url',
        },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Movie1',
          genre: 'Action',
          releaseDate: '2022-09-05',
          moviePoster: 'url',
        })
      );
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.HSET = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest(
        {
          title: 'Movie1',
          genre: 'Action',
          releaseDate: '2022-09-05',
          moviePoster: 'url',
        },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating movie',
      });
    });

    it('should return 400 if title is missing', async () => {
      req = mockRequest(
        { genre: 'Action', releaseDate: '2022-09-05', moviePoster: 'url' },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'title, genre, and releaseDate are required fields',
      });
    });

    it('should return 400 if genre is missing', async () => {
      req = mockRequest(
        { title: 'Movie1', releaseDate: '2022-09-05', moviePoster: 'url' },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'title, genre, and releaseDate are required fields',
      });
    });

    it('should return 400 if releaseDate is missing', async () => {
      req = mockRequest(
        { title: 'Movie1', genre: 'Action', moviePoster: 'url' },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'title, genre, and releaseDate are required fields',
      });
    });

    it('should return 400 for invalid title format', async () => {
      req = mockRequest(
        {
          title: {},
          genre: 'Action',
          releaseDate: '2022-09-05',
          moviePoster: 'url',
        },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid data types: title and genre must be strings',
      });
    });

    it('should return 400 for invalid genre format', async () => {
      req = mockRequest(
        {
          title: 'Movie1',
          genre: {},
          releaseDate: '2022-09-05',
          moviePoster: 'url',
        },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid data types: title and genre must be strings',
      });
    });

    it('should return 400 for invalid releaseDate format', async () => {
      req = mockRequest(
        {
          title: 'Movie1',
          genre: 'Action',
          releaseDate: {},
          moviePoster: 'url',
        },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid data type: releaseDate must be a date type',
      });
    });

    it('should return 400 for invalid moviePoster format', async () => {
      req = mockRequest(
        {
          title: 'Movie1',
          genre: 'Action',
          releaseDate: '2022-09-05',
          moviePoster: {},
        },
        {}
      );

      await createMovie(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid data type: moviePoster must be a string',
      });
    });
  });

  describe('getAllMovies', () => {
    it('should successfully get all movies', async () => {
      // Mocking the Redis LRANGE function to return a list of movies
      mockRedisClient.LRANGE = jest
        .fn()
        .mockResolvedValue([
          '{"id": "1", "title": "Movie1"}',
          '{"id": "2", "title": "Movie2"}',
        ]);

      // No parameters needed for this request
      req = mockRequest({}, {});

      await getAllMovies(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', title: 'Movie1' },
        { id: '2', title: 'Movie2' },
      ]);
    });

    it('should return 500 if an error occurs', async () => {
      // Mocking a Redis error
      mockRedisClient.LRANGE = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest({}, {});

      await getAllMovies(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching movies',
      });
    });

    it('should return 404 if no movies are found', async () => {
      // Mocking the Redis LRANGE function to return null
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(null);

      req = mockRequest({}, {});

      await getAllMovies(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No movies found' });
    });
  });

  describe('getMovieById', () => {
    it('should successfully get a movie by ID', async () => {
      // Mocking Redis HGETALL function to return a movie
      mockRedisClient.HGETALL = jest
        .fn()
        .mockResolvedValue({
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
        id: '1',
        title: 'Movie1',
        genre: 'Action',
        releaseDate: '2022-09-05',
        moviePoster: 'url',
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
        message: 'Error fetching movie',
      });
    });

    it('should return 404 for a nonexistent movie ID', async () => {
      // Mocking the Redis HGETALL function to return null
      mockRedisClient.HGETALL = jest.fn().mockResolvedValue(null);

      req = mockRequest({}, { id: 'nonexistent' });

      await getMovieById(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Movie not found' });
    });

    it('should return 400 for an invalid movie ID format', async () => {
      req = mockRequest({}, { id: {} });

      await getMovieById(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid movie ID format',
      });
    });
  });
});
