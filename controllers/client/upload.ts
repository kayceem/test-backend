import { Request, Response, NextFunction } from "express";
import { BACKEND_URL } from "../../config/backend-domain";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

export const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videoPath: string = req.file.path;

    const fullVideoPath: string = `${BACKEND_URL}/${videoPath}`;

    const response = {
      message: "Video uploaded successfully",
      videoPath: fullVideoPath,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(
        "An error occurred while uploading the video",
        422
      );
      return next(customError);
    }
  }
};
