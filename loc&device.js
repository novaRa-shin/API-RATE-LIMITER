const Redis = require("ioredis");

const redisClient = new Redis("redis://localhost:6379");

const RATE_LIMIT_DURATION = 60;  // seconds
const MAX_REQUESTS = 5;

module.exports = {
  ratelimiter: async (req, res, next) => {
    const userId = req.headers["user_id"];
    const location = req.headers["x-location"];
    const deviceId = req.headers["device_id"];

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing user_id header" });
    }
    if (!location) {
      return res.status(400).json({ success: false, message: "Missing x-location header" });
    }
    if (!deviceId) {
      return res.status(400).json({ success: false, message: "Missing device_id header" });
    }

    const key = `rate_limit:${userId}:${location}:${deviceId}`;
    const currentTime = Math.floor(Date.now() / 1000);

    const result = await redisClient.hgetall(key);

    if (!result || Object.keys(result).length === 0) {
      await redisClient.hset(key, "createdAt", currentTime, "count", 1);
      await redisClient.expire(key, RATE_LIMIT_DURATION);
      return next();
    }

    const createdAt = parseInt(result["createdAt"]);
    const count = parseInt(result["count"]);
    const diff = currentTime - createdAt;

    if (diff > RATE_LIMIT_DURATION) {
      await redisClient.hset(key, "createdAt", currentTime, "count", 1);
      await redisClient.expire(key, RATE_LIMIT_DURATION);
      return next();
    }

    if (count >= MAX_REQUESTS) {
      return res.status(429).json({ success: false, message: "User rate limited" });
    }

    await redisClient.hincrby(key, "count", 1);
    return next();
  }
};
