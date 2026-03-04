import express from "express";

const router = express.Router();

/*
GET /xyz/test
Basic test endpoint
*/

router.get("/test", (req, res) => {
  res.json({
    service: "xyz",
    status: "running",
    message: "Test route working"
  });
});

export default router;