const Redis = require("ioredis");
const moment = require("moment");


const redisClient = new Redis("redis://localhost:6379");

const ratelimit_duration_sec = 60;
const num_of_request = 5;

module.exports = {
    ratelimiter: async (req, res, next) => {
        const userId = req.headers["user_id"];
        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing user_id header" });
        }

        const currenttime = moment().unix();
        const result = await redisClient.hgetall(userId);

        if (!result || Object.keys(result).length === 0) {
         
            await redisClient.hset(userId, "createdAt", currenttime, "count", 1);
            return next();
        }

        let diff = currenttime - parseInt(result["createdAt"]);

        if (diff > ratelimit_duration_sec) {

            await redisClient.hset(userId, "createdAt", currenttime, "count", 1);
            return next();
        }

        if (parseInt(result["count"]) >= num_of_request) {
            return res.status(429).json({ success: false, message: "User rate limited" });
        } else {
          
            let newCount = parseInt(result["count"]) + 1;
            await redisClient.hset(userId, "count", newCount);
            return next();
        }
    }
};
