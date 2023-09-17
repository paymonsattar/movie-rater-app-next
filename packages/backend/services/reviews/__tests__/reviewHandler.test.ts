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

  // addReview test cases
  describe('addReview', () => {
    it('should successfully add a review', async () => {
      req = mockRequest({ movieId: '1', review: '5' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Review added' })
      );
    });

    it('should return 500 if an error occurs', async () => {
      // 👇️ Simulate an error using Promises
      mockRedisClient.RPUSH = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));

      req = mockRequest({ movieId: '1', review: '5' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Redis error' });
    });

    it('should return 400 if movieId is missing', async () => {
      req = mockRequest({ review: '5' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'movieId is required' });
    });

    it('should return 400 if review is missing', async () => {
      req = mockRequest({ movieId: '1' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'review is required' });
    });

    it('should return 400 if review is below 0', async () => {
      req = mockRequest({ movieId: '1', review: '-1' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid review value, must be between 0 and 5',
      });
    });

    it('should return 400 if review is above 5', async () => {
      req = mockRequest({ movieId: '1', review: '6' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid review value, must be between 0 and 5',
      });
    });

    it('should allow duplicate reviews for the same movieId', async () => {
      req = mockRequest({ movieId: '1', review: '5' }, {});

      await addReview(redisClient)(req, res);
      await addReview(redisClient)(req, res); // duplicate review

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Review added' })
      );
    });

    it('should return 400 for invalid movieId format', async () => {
      req = mockRequest({ movieId: {}, review: '5' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid movieId format',
      });
    });

    it('should return 400 for invalid review format', async () => {
      req = mockRequest({ movieId: '1', review: {} }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid review value, must be between 0 and 5',
      });
    });
  });

  describe('getReviews', () => {
    it('should successfully get reviews', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(['5', '4']);
      req = mockRequest({}, { movieId: '1' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ reviews: ['5', '4'] });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.LRANGE = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));
      req = mockRequest({}, { movieId: '1' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Redis error' });
    });

    it('should return 404 for nonexistent movieId', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(null);
      req = mockRequest({}, { movieId: 'nonexistent' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No reviews found for this movieId',
      });
    });

    it('should return 400 for invalid movieId format', async () => {
      req = mockRequest({}, { movieId: {} });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid movieId format',
      });
    });
  });

  describe('getReviewAverage', () => {
    it('should successfully get review average', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(['5', '4']);
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ average: 4.5 });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.LRANGE = jest
        .fn()
        .mockRejectedValue(new Error('Redis error'));
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Redis error' });
    });

    it('should return 404 if movieId has no reviews', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(null);
      req = mockRequest({}, { movieId: 'nonexistent' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No reviews found for this movieId',
      });
    });
  });
});
