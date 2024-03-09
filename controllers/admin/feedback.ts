import { Request, Response, NextFunction } from "express";
import Feedback from "../../models/Feedback";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

export const getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = (req.query._q as string) || "";
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = {
      isDeleted: false,
      ...(searchTerm ? { name: { $regex: searchTerm, $options: "i" } } : {}),
    };

    const total = await Feedback.countDocuments(query);

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      message: "Fetch feedbacks successfully!",
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      feedbacks,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch feedbacks!", 422);
      return next(customError);
    }
  }
};

export const getFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await Feedback.findOne({ _id: feedbackId, isDeleted: false });

    if (!feedback) {
      const error = new CustomError("Feedback", "Feedback not found", 404);
      throw error;
    }

    res.status(200).json({
      message: "Fetch feedback by id successfully!",
      feedback,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch feedback by id!", 422);
      return next(customError);
    }
  }
};

export const deleteFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      const error = new CustomError("Feedback", "Feedback not found", 404);
      throw error;
    }

    feedback.isDeleted = true;
    await feedback.save();

    res.status(200).json({
      message: "Feedback deleted successfully!",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to delete feedback!", 422);
      return next(customError);
    }
  }
};
