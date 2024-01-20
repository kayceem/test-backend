import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
import { IUser } from "./User";
import { ICourse } from "./Course";

export interface ICertificate extends IBaseSchema {
  certificateName: string;
  user: IUser;
  course: ICourse;
  dateValid?: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateName: { type: String, required: true },
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    course: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    },
    dateValid: { type: Date },
  },
  { timestamps: true }
);

certificateSchema.add(baseSchema);

const Certificate = model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
