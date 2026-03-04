import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vpjoshi.in",
  "https://www.vpjoshi.in"
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  }
});

export default corsMiddleware;