import { createClient } from 'redis';

// 🧠 This module exports the RedisClient type, which is inferred from the return type
// of the createClient function from the 'redis' package. This is to accomodate unit
// tests that rely on the 'redis-mock' library, which import 

// 👇️ Creating a type alias for the Redis client
export type RedisClient = ReturnType<typeof createClient>;
