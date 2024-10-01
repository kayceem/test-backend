import dotenv from 'dotenv';
dotenv.config(); 
import express, { NextFunction, Response, Request } from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import authRouter from "./routes/auth";
import clientRouter from "./routes/client";
import adminRouter from "./routes/admin";
import initializeAdminUser from "./utils/initializeAdmin";
import { MONGODB_URI } from "./config/constant";
import { FRONTEND_URL } from "./config/frontend-domain";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socket.type";


const app = express();

app.use(cors());

const port = process.env.PORT || 9000;

app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// Define storage for uploaded files and public the path folder for users
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, userId, adminRole, userRole, role"
  );

  next();
});
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use(clientRouter);


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
let io;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(port, () => {
      initializeAdminUser()
      console.log(`App listening on port ${port}`);
    });
    io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
      server,
      {
        cors: {
          origin: `${FRONTEND_URL}`,
          methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
        },
        transports: ["websocket"],  
      }
    );
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
export { io };
