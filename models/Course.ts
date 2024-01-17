import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface ICourse extends IBaseSchema {
  name: string;
  subTitle?: string;
  thumbnail: string;
  access: string;
  views: number;
  price: number;
  finalPrice: number;
  description: string;
  level: string;
  courseSlug: string;
  userId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  requirements?: string[];
  willLearns?: string[];
  tags?: string[];
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    subTitle: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    access: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    courseSlug: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    willLearns: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

courseSchema.add(baseSchema);

courseSchema.index({ name: "text", description: "text" });

const Course = model<ICourse>("Course", courseSchema);

export default Course;
