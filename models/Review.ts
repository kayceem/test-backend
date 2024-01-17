import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IReview extends IBaseSchema {
  courseId: Schema.Types.ObjectId;
  title: string;
  content: string;
  ratingStar: number;
  orderId: Schema.Types.ObjectId;
}

const reviewSchema = new Schema<IReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    ratingStar: {
      type: Number,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.add(baseSchema);

const Review = model<IReview>("Review", reviewSchema);

export default Review;
