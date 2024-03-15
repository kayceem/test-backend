import { Request, Response, NextFunction } from "express";
import Feedback from "../../models/Feedback";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import mongoose, { ClientSession } from "mongoose";
import { coreHelper } from "../../utils/coreHelper";
import ActionLog from "../../models/ActionLog";
import { enumData } from "../../config/enumData";
import { AuthorAuthRequest } from "../../middleware/is-auth";
import {
  CREATE_SUCCESS,
  ERROR_CREATE_DATA,
  ERROR_GET_DATA,
  ERROR_GET_DATA_DETAIL,
  ERROR_GET_DATA_HISTORIES,
  ERROR_NOT_FOUND_DATA,
  ERROR_UPDATE_ACTIVE_DATA,
  ERROR_UPDATE_DATA,
  GET_DETAIL_SUCCESS,
  GET_HISOTIES_SUCCESS,
  GET_SUCCESS,
  UPDATE_ACTIVE_SUCCESS,
  UPDATE_SUCCESS,
} from "../../config/constant";

export const getFeedbacks = async (req: AuthorAuthRequest, res: Response, next: NextFunction) => {
  try {
    const searchTerm = (req.query._q as string) || "";
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;

    const statusFilter = (req.query._status as string) || "all";

    let query = {
      ...(statusFilter === "active" ? { isDeleted: false } : {}),
      ...(statusFilter === "inactive" ? { isDeleted: true } : {}),
      ...(searchTerm ? { name: { $regex: searchTerm, $options: "i" } } : {}),
    };

    const total = await Feedback.countDocuments(query);

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      message: GET_SUCCESS,
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
      const customError = new CustomErrorMessage(ERROR_GET_DATA, 422);
      return next(customError);
    }
  }
};

export const getFeedbackById = async (req: Request, res: Response, next: NextFunction) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await Feedback.findOne({ _id: feedbackId })
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    if (!feedback) {
      const error = new CustomError("Feedback", ERROR_NOT_FOUND_DATA, 404);
      throw error;
    }

    res.status(200).json({
      message: GET_DETAIL_SUCCESS,
      feedback,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_GET_DATA_DETAIL, 422);
      return next(customError);
    }
  }
};

export const updateActiveStatusFeedback = async (
  req: AuthorAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { feedbackId } = req.body;

  let session: ClientSession | null = null;
  session = await mongoose.startSession();
  session.startTransaction();

  try {
    const foundFeedback = await Feedback.findById(feedbackId);

    if (!foundFeedback) {
      const error = new CustomError("Feedback", ERROR_NOT_FOUND_DATA, 404);
      throw error;
    }

    foundFeedback.isDeleted = !foundFeedback.isDeleted;
    foundFeedback.updatedAt = new Date();
    foundFeedback.updatedBy = new mongoose.Types.ObjectId(req.userId) as any;

    const feedbackRes = await foundFeedback.save();

    const type =
      foundFeedback.isDeleted === false
        ? `${enumData.ActionLogEnType.Activate.code}`
        : `${enumData.ActionLogEnType.Deactivate.code}`;
    const typeName =
      foundFeedback.isDeleted === false
        ? `${enumData.ActionLogEnType.Activate.name}`
        : `${enumData.ActionLogEnType.Deactivate.name}`;

    const createdBy = new mongoose.Types.ObjectId(req.userId) as any;
    const historyDesc = `User [${req.username}] has [${typeName}] Feedback`;
    const functionType = "FEEDBACK";

    const historyItem = new ActionLog({
      feedbackId: feedbackRes._id,
      type,
      createdBy,
      functionType,
      description: historyDesc,
    });

    await ActionLog.collection.insertOne(historyItem.toObject(), {
      session: session,
    });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: UPDATE_ACTIVE_SUCCESS,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_UPDATE_ACTIVE_DATA, 422);
      return next(customError);
    }
  }
};

export const loadHistoriesForFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { feedbackId } = req.params;

  try {
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;

    const [results, count] = await Promise.all([
      ActionLog.find({ feedbackId: feedbackId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ActionLog.countDocuments({ feedbackId: feedbackId }),
    ]);

    res.status(200).json({
      message: GET_HISOTIES_SUCCESS,
      results: results,
      count,
      page,
      pages: Math.ceil(count / limit),
      limit,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_GET_DATA_HISTORIES, 422);
      return next(customError);
    }
  }
};
