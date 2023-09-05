import { Request, Response } from 'express';
import redis from 'redis-mock';
import { addReview, getReviews, getReviewAverage } from '../src/handlers/reviewHandlers'; // Replace with the actual module name
import { RedisClient } from '../src/types'; // Replace with the actual module name

jest.mock('redis', () => redis)

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

describe('Review Operations', () => {
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
    redisClient = mockRedisClient as unknown as RedisClient
  });

  // addReview test cases
  describe('addReview', () => {
    it('should successfully add a review', async () => {
      req = mockRequest({ movieId: '1', review: '5' }, {});

      await addReview(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Review added' }));
    });

    it('should return 500 if an error occurs', async () => {
      // Simulate an error using Promises
      mockRedisClient.RPUSH = jest.fn().mockRejectedValue(new Error('Redis error'));

      req = mockRequest({ movieId: '1', review: '5' }, {});
    
      await addReview(redisClient)(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Redis error' });
    });
  });
  
  // getReviews test cases
  describe('getReviews', () => {
    it('should successfully get reviews', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(['5', '4']);
      req = mockRequest({}, { movieId: '1' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ reviews: ['5', '4'] });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.LRANGE = jest.fn().mockRejectedValue(new Error('Redis error'));
      req = mockRequest({}, { movieId: '1' });

      await getReviews(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Redis error' });
    });
  });

  // getReviewAverage test cases
  describe('getReviewAverage', () => {
    it('should successfully get review average', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue(['5', '4']);
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ average: 4.5 });
    });

    it('should return an average of 0 if no reviews are present', async () => {
      mockRedisClient.LRANGE = jest.fn().mockResolvedValue([]);
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ average: 0 });
    });

    it('should return 500 if an error occurs', async () => {
      mockRedisClient.LRANGE = jest.fn().mockRejectedValue(new Error('Redis error'));
      req = mockRequest({}, { movieId: '1' });

      await getReviewAverage(redisClient)(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Redis error' });
    });
  });
});
