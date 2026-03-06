import express from "express";
import corsMiddleware from "./middleware/cors.js";
import rateLimiter from "./middleware/rateLimiter.js";

import portfolioRoutes from "./routes/portfolio.routes.js";
import xyzRoutes from "./routes/xyz.routes.js";
import healthRoutes from "./routes/health.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1. Trust internal networks safely
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]); 

// 2. Parse JSON
app.use(express.json());

// 3. Apply CORS globally (must be before routes)
app.use(corsMiddleware);

// 4. Apply Global Rate Limiting
app.use(rateLimiter);

// 5. Register Routes
app.use("/portfolio", portfolioRoutes);
app.use("/xyz", xyzRoutes);
app.use("/health", healthRoutes);

app.listen(3000, () => {
  console.log("SelfHosted API running cleanly on port 3000");
});