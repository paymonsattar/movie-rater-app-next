import { createClient } from 'redis';

// 🧠 This module exports the RedisClient type, which is inferred from the return type
// of the createClient function from the 'redis' package.

// 👇️ Creating a type alias for the Redis client
export type RedisClient = ReturnType<typeof createClient>;

