require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");
const logger = require("./utils/logger");

const healthRoutes = require("./routes/health.routes");
// const authRoutes = require('./routes/auth.routes');
// const productRoutes = require('./routes/product.routes');
// const clientRoutes = require('./routes/client.routes');
// const vendorRoutes = require('./routes/vendor.routes');
// const invoiceRoutes = require('./routes/invoice.routes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});
app.use(limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/invoices', invoiceRoutes);

app.use("/{*splat}", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`📡 Health check: http://localhost:${PORT}/api/health`);
});

process.on("SIGTERM", () => {
  logger.warn("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.warn("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  server.close(() => process.exit(1));
});

module.exports = app;
