import dns from "dns";

dns.setServers(["1.1.1.1","8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import corsMiddleware from "./middleware/cors.js";
import rateLimiter from "./middleware/rateLimiter.js";

import portfolioRoutes from "./routes/portfolio.routes.js";
import xyzRoutes from "./routes/xyz.routes.js";
import healthRoutes from "./routes/health.routes.js";



import dotenv from "dotenv";
dotenv.config();

const app = express();

app.set("trust proxy", 1); // trust first proxy for correct IP detection
app.use(express.json());
app.use(corsMiddleware);
app.use(rateLimiter);

app.use("/portfolio", portfolioRoutes);
app.use("/xyz", xyzRoutes);
app.use("/health", healthRoutes);

app.listen(3000, () => {
  console.log("SelfHosted API running on port 3000");
});