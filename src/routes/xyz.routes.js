import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    service: "xyz",
    status: "running",
    message: "Test route working"
  });
});

export default router;