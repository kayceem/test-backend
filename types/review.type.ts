import { Schema } from "mongoose";
import { IBaseSchema } from "./base.type";

export interface IReview extends IBaseSchema {
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  title: string;
  content: string;
  ratingStar: number;
  orderId: Schema.Types.ObjectId;
}
