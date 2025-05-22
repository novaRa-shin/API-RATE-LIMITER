const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Redis = require('ioredis');
const redis = new Redis();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // or '*' to allow all origins (less secure)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user_id'] // Add your custom headers here
}));// Enable CORS for frontend requests
app.use(bodyParser.json());

let rateLimitConfig = { maxRequests: 5, duration: 60 }; // default config

// Rate limiter middleware
async function ratelimiter(req, res, next) {
  const userId = req.headers['user_id'];
  if (!userId) return res.status(400).json({ message: 'Missing user_id header' });

  const key = `rate_limit:user:${userId}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    const data = await redis.hgetall(key);

    if (!data || Object.keys(data).length === 0) {
      await redis.hset(key, 'count', 1, 'start', now);
      await redis.expire(key, rateLimitConfig.duration);
      return next();
    }

    const count = parseInt(data.count, 10);
    const start = parseInt(data.start, 10);

    if (now - start >= rateLimitConfig.duration) {
      await redis.hset(key, 'count', 1, 'start', now);
      await redis.expire(key, rateLimitConfig.duration);
      return next();
    }

    if (count >= rateLimitConfig.maxRequests) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }

    await redis.hincrby(key, 'count', 1);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

app.use(ratelimiter);

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Request accepted' });
});

app.post('/config', (req, res) => {
  const { maxRequests, duration } = req.body;
  if (
    typeof maxRequests !== 'number' || maxRequests < 1 ||
    typeof duration !== 'number' || duration < 1
  ) {
    return res.status(400).json({ message: 'Invalid config' });
  }
  rateLimitConfig = { maxRequests, duration };
  res.json({ success: true, config: rateLimitConfig });
});

app.listen(7005, () => {
  console.log('Server running on port 7005');
});

