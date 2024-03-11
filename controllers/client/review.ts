import { Request, Response, NextFunction } from "express";
import Review from "../../models/Review";
import Order from "../../models/Order";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import mongoose, { ClientSession } from "mongoose";
import { coreHelper } from "../../utils/coreHelper";
import ActionLog from "../../models/ActionLog";
import { enumData } from "../../config/enumData";
import { UserAuthRequest } from "../../middleware/is-user-auth";
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

export const postReview = async (req: UserAuthRequest, res: Response, next: NextFunction) => {
  const { courseId, title, content, ratingStar, orderId, userId } = req.body;

  let session: ClientSession | null = null;

  session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reviewCode = await coreHelper.getCodeDefault("REVIEW", Review);

    const review = new Review({
      code: reviewCode,
      courseId,
      title,
      content,
      ratingStar,
      orderId,
      userId,
      createdBy: userId,
    }); 

    const reviewRes = await review.save();

    await Order.updateOne(
      { _id: orderId, "items._id": courseId },
      { $set: { "items.$.reviewed": true } }
    );

    const historyItem = new ActionLog({
      reviewId: reviewRes._id,
      type: enumData.ActionLogEnType.Create.code,
      createdBy: new mongoose.Types.ObjectId(req.userId),
      functionType: "REVIEW",
      description: `User [${req.username}] has [${enumData.ActionLogEnType.Create.name}] Review`,
    });

    await ActionLog.collection.insertOne(historyItem.toObject(), { session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: CREATE_SUCCESS,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage(ERROR_CREATE_DATA, 422);
      return next(customError);
    }
  }
};
