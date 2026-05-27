const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;

  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Something went wrong. Please try again later."
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
