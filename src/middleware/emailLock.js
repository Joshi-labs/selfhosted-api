const ipStore = new Map();

const EMAIL_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

function emailLock(req, res, next) {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now = Date.now();
  const lastSent = ipStore.get(ip);

  if (lastSent && now - lastSent < EMAIL_COOLDOWN) {
    return res.status(429).json({
      code: 429,
      success: false,
      message: "You have already sent a message. Please try again after 24 hours."
    });
  }

  req.senderIP = ip;
  next();
}

export function markEmailSent(ip) {
  ipStore.set(ip, Date.now());
}

export default emailLock;