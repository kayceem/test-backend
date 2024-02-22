import { Request, Response, NextFunction } from "express";
import Review from "../../models/Review";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = (req.query._q as string) || "";
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;

    const statusFilter = (req.query._status as string) || "all";

    let query = {
      ...(statusFilter === "active" ? { isDeleted: false } : {}),
      ...(statusFilter === "inactive" ? { isDeleted: true } : {}),
      ...(searchTerm ? { title: { $regex: searchTerm, $options: "i" } } : {}),
    };

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .populate("userId", "name")
      .populate("courseId", "name");

    res.status(200).json({
      message: "Fetch reviews successfully!",
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      reviews,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch reviews!", 422);
      return next(customError);
    }
  }
};

export const getReview = async (req: Request, res: Response, next: NextFunction) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findOne({ _id: reviewId })
      .populate("userId", "name")
      .populate("courseId", "name");

    if (!review) {
      const error = new CustomError("Review", "Review not found", 404);
      throw error;
    }

    res.status(200).json({
      message: "Fetch review by id successfully!",
      review,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch review by id!", 422);
      return next(customError);
    }
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      const error = new CustomError("Review", "Review not found", 404);
      throw error;
    }

    review.isDeleted = true;
    await review.save();

    res.status(200).json({
      message: "Review deleted successfully!",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to delete review!", 422);
      return next(customError);
    }
  }
};

export const undeleteReview = async (req: Request, res: Response, next: NextFunction) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      const error = new CustomError("Review", "Review not found", 404);
      throw error;
    }

    review.isDeleted = false;
    await review.save();

    res.status(200).json({
      message: "Review undeleted successfully!",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to undelete review!", 422);
      return next(customError);
    }
  }
};
