import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";

export interface IFeedback extends IBaseSchema {
  name: string;
  email: string;
  message: string;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.add(baseSchema);

const Feedback = model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
