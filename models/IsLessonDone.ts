import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IIsLessonDone extends IBaseSchema {
  userId: Schema.Types.ObjectId;
  lessonId: Schema.Types.ObjectId;
  isDone: boolean;
}

const isLessonDoneSchema = new Schema<IIsLessonDone>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Lesson",
    },
    isDone: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

isLessonDoneSchema.add(baseSchema);

const IsLessonDone = model<IIsLessonDone>("IsLessonDone", isLessonDoneSchema);

export default IsLessonDone;
