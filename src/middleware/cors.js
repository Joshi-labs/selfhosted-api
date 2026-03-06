import cors from "cors";

const allowedOrigins = [
  "https://vpjoshi.in",
  "https://www.vpjoshi.in"
];

const corsMiddleware = cors({
  origin: allowedOrigins, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  optionsSuccessStatus: 200 
});

export default corsMiddleware;