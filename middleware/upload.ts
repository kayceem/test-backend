const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
import { Request } from 'express';
const fileStorage = multer.diskStorage({
  destination: (req: Request, file: File, cb: Function) => {
    cb(null, "images");
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, uuidv4().substring(0, 8) + "-" + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and JPEG files are allowed."));
  }
};

// module.exports = multer({
//   storage: fileStorage,
//   filter: fileFilter,
// });

const uploadMiddleware = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

export default uploadMiddleware;