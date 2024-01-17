import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";

export interface ICertificate extends IBaseSchema {
  certificateName: string;
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  dateValid: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateName: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    dateValid: { type: Date, required: true },
  },
  { timestamps: true }
);

certificateSchema.add(baseSchema);

const Certificate = model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
