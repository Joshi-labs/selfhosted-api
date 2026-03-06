import express from "express";
import helmet from "helmet";
import corsMiddleware from "./middleware/cors.js";
import rateLimiter from "./middleware/rateLimiter.js";

import portfolioRoutes from "./routes/portfolio.routes.js";
import healthRoutes from "./routes/health.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(corsMiddleware);
app.use(rateLimiter);

app.use("/portfolio", portfolioRoutes);
app.use("/health", healthRoutes);

app.listen(3000, () => {
  console.log("SelfHosted API running cleanly on port 3000");
});