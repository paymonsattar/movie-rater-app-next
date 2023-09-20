import { Request, Response } from 'express';
import redis from 'redis-mock';
import {
  addReview,
  getReviews,
  getReviewAverage,
} from '../src/handlers/reviewHandlers';
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

describe('Movie Review API handlers tests', () => {
  let req: Request;
  let res: jest.Mocked<Response>;
  let mockRedisClient: ReturnType<typeof redis.createClient>;
  let redisClient: RedisClient;

  const mockReview = {
   movieId: '1',
   rating: 5,
   comment: 'mock comment' 
  }

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

  describe('addReview', () => {
    it('should successfully add a review', async () => {
      req = mockRequest(mockReview, {});

      await addReview(redisClient)(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        status: 'success',
        body: {
          message: 'Review added',
          review: expect.objectContaining({
            ...mockReview,
            id: expect.any(String),
          }),
        },
      });
    });

    it('should return 500 if an error occurs', async () => {
      // 👇️ Simulate an error using Promises
      mockRedisClient.RPUSH = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest(mockReview, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Redis error',
        status: 'error',
      });
    });

    it('should return 400 if movieId is missing', async () => {
      req = mockRequest({ ...mockReview, movieId: null }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'movieId and rating are required fields',
        status: 'error',
      });
    });

    it('should return 400 if review is missing', async () => {
      req = mockRequest({ ...mockReview, rating: null }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'movieId and rating are required fields',
        status: 'error',
      });
    });

    it('should return 400 if review is below 0', async () => {
      req = mockRequest({ ...mockReview, rating: -1 }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid review value, must be between 0 and 5',
        status: 'error',
      });
    });

    it('should return 400 if review is above 5', async () => {
      req = mockRequest({ ...mockReview, rating: 6 }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid review value, must be between 0 and 5',
        status: 'error',
      });
    });

    it('should allow duplicate reviews for the same movieId', async () => {
      req = mockRequest({ ...mockReview }, {});

      await addReview(redisClient)(req, res);
      await addReview(redisClient)(req, res); // duplicate review

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        status: 'success',
        body: { 
          message: 'Review added',
          review: expect.objectContaining({
            ...mockReview,
            id: expect.any(String),
          })
        }
      });
    });

    it('should return 400 for invalid movieId format', async () => {
      req = mockRequest({ ...mockReview, movieId: {} }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid movieId format',
        status: 'error',
      });
    });

    it('should return 400 for invalid review format', async () => {
      req = mockRequest({ ...mockReview, rating: {} }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Invalid review value, must be between 0 and 5',
        status: 'error',
      });
    });
  });

  describe('getReviews', () => {
    it('should successfully get reviews', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue([
         JSON.stringify({ ...mockReview, rating: 4 }),
         JSON.stringify({ ...mockReview, rating: 5 }),
      ]);

      req = mockRequest({}, { movieId: '1' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        status: 'success',
        body: {
          reviews: [
            { ...mockReview, rating: 4 },
            { ...mockReview, rating: 5 },
          ]
        },
      });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.LRANGE = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));
      req = mockRequest({}, { movieId: '1' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        status: 'error',
        message: 'Redis error',
      });
    });

    it('should return 404 for nonexistent movieId', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(null);
      req = mockRequest({}, { movieId: 'nonexistent' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        status: 'error',
        message: 'No reviews found for this movieId',
      });
    });

    it('should return 400 for invalid movieId format', async () => {
      req = mockRequest({}, { movieId: {} });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        status: 'error',
        message: 'Invalid movieId format',
      });
    });
  });

  describe('getReviewAverage', () => {
    it('should successfully get review average', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue([
         JSON.stringify({ ...mockReview, rating: 4 }),
         JSON.stringify({ ...mockReview, rating: 5 }),
      ]);
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        body: {
          average: 4.5,
        },
        status: 'success',
      });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.LRANGE = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Redis error',
        status: 'error',
      });
    });

    it('should return 404 if movieId has no reviews', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(null);
      req = mockRequest({}, { movieId: 'nonexistent' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        message: 'No reviews found for this movieId',
        status: 'error',
      });
    });
  });
});
