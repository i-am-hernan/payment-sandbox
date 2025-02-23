import { createClient } from 'redis';
declare global {
  var redis: any; // This must be a `var` and not a `let / const`
}

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error(
    "Please define the REDIS_URL environment variable inside .env.local"
  );
}

let cached = global.redis;

if (!cached) {
  cached = global.redis = { conn: null, promise: null };
}

async function redisConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const client = createClient({
      url: REDIS_URL,
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: false
      }
    });

    // Error logging
    client.on('error', (err) => console.error('Redis Client Error', err));

    cached.promise = client.connect().then(() => {
      return client;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper to safely disconnect
export async function disconnect() {
  if (cached.conn) {
    await cached.conn.quit();
    cached.conn = null;
    cached.promise = null;
  }
}

export default redisConnect; 