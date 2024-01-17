import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";

export interface ICertificate extends IBaseSchema {
  name: string;
  courseId: Schema.Types.ObjectId;
  dateValid: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true },
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
