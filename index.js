const express = require("express");
const ratelimiter = require("./rate-limiter"); // Import rate limiter

const app = express();

app.use(ratelimiter.ratelimiter); // Use rate limiter for all routes

app.get("/ping", async (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "pong",
    });
});

app.listen(7005, function () {
    console.log("Server started at port 7005");
});
