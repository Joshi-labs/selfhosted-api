import cors from "cors";

const allowedOrigins = [
  "https://vpjoshi.in",
  "https://www.vpjoshi.in"
];

const corsMiddleware = cors({
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204 
});

export default corsMiddleware;