import { Request, Response, NextFunction } from "express";
import Feedback from "../../models/Feedback";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, message } = req.body;

    const feedback = new Feedback({
      name,
      email,
      message,
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback created successfully!",
      feedback,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to create feedback!", 422);
      return next(customError);
    }
  }
};
