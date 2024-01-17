import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IIsLessonDone extends IBaseSchema {
  lessonId: Schema.Types.ObjectId;
  isDone: boolean;
}

const isLessonDoneSchema = new Schema<IIsLessonDone>(
  {
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
