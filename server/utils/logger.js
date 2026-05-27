const winston = require("winston");

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

module.exports = logger;
