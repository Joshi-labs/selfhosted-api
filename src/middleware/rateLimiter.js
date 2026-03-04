import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10,        // 10 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    success: false,
    message: "Too many requests"
  }
});

export default rateLimiter;