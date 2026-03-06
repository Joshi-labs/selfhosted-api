import rateLimit from "express-rate-limit";

const EMAIL_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

const emailLock = rateLimit({
  windowMs: EMAIL_COOLDOWN,
  max: 1, // Limit each IP to 1 request per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // Explicitly grab the Cloudflare IP
keyGenerator: (req, res) => {
    // Strictly rely on proxy headers to satisfy the rate-limiter validation
    return req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || "unknown";
  },
  message: {
    code: 429,
    success: false,
    message: "You have already sent a message. Please try again after 6 hours."
  }
});

export default emailLock;