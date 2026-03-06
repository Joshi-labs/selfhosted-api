import rateLimit from "express-rate-limit";

const EMAIL_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

const emailLock = rateLimit({
  windowMs: EMAIL_COOLDOWN,
  max: 1, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers["cf-connecting-ip"] || "unknown-ip";
  },
  message: {
    code: 429,
    success: false,
    message: "You have already sent a message. Please try again after 6 hours."
  }
});

export default emailLock;