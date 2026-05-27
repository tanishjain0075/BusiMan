const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BusiMan API is running!",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

module.exports = router;
