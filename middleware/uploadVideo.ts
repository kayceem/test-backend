const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
import { Request, Response } from 'express';
const videoStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    cb(null, "videos");
  },
  filename: (req: Request, file: any, cb: Function) => {
    cb(null, uuidv4().substring(0, 8) + "-" + file.originalname);
  },
});

const videoFilter = (req: Request, file: any, cb: Function) => {
  if (
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/quicktime" ||
    file.mimetype === "video/mpeg" ||
    file.mimetype === "video/avi"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only video formats such as MP4, QuickTime, MPEG, and AVI are allowed."
      )
    );
  }
};

module.exports = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
});
