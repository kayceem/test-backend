import express, { NextFunction, Response, Request } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./routes/auth";
import clientRouter from "./routes/client";
// const adminCategoryRouter = require("./routes/adminCategory");
// const adminCourseRouter = require("./routes/adminCourse");
// const adminSectionRouter = require("./routes/adminSection");
import adminLessonRouter from "./routes/adminLesson";
// const adminUserRouter = require("./routes/adminUser");
// const adminOrderRouter = require("./routes/adminOrder");
// const clientRouter = require("./routes/client");
// const reportRouter = require("./routes/report");
import blogRouter from "./routes/blog";
// const paymentRouter = require("./routes/payment");
import commentsRouter from "./routes/comments";
import noteRouter from "./routes/note";

import userCourseRouter from "./routes/userCourse";

const app = express();

app.use(cors());

const port = process.env.PORT || 9000;

const MONGODB_URI = "mongodb://127.0.0.1:27017/e_learning";

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, userId, adminRole, userRole"
  );
  next();
});

app.use("/auth", authRouter);
app.use(clientRouter);

// app.use("/admin", adminCategoryRouter);
// app.use("/admin", adminCourseRouter);
// app.use("/admin", adminSectionRouter);
app.use("/admin", adminLessonRouter);
// app.use("/admin", adminUserRouter);
// app.use("/admin", adminOrderRouter);
// app.use("/admin", reportRouter);

app.use("/userCourse", userCourseRouter);
app.use("/blog", blogRouter);
app.use("/comments", commentsRouter);
app.use("/note", noteRouter);

// app.use("/payments", paymentRouter);

// app.use(clientRouter);

interface AppError extends Error {
  statusCode?: number;
  errorType?: string;
  data?: any;
}

app.use((error: AppError, req: Request, res: Response, next: NextFunction): void => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const errorType = error.errorType || "unknown";
  const data = error.data;

  res.status(status).json({
    message: message,
    errorType: errorType,
    data: data,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
