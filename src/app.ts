import express from "express";
import type { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/globalErrorHandler.js";

const app: Application = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


// Routes
app.use("/api", router);
app.use(errorHandler);

export default app;
