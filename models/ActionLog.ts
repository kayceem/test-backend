import { Schema, model } from "mongoose";
import baseSchema from "./BaseSchema";
import { IActionLog } from "../types/actionLog.type";

const actionLogSchema = new Schema<IActionLog>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String, // DRAFT, SOON, FREE, PAID, PUBLIC, PRIVATE
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    createdByName: {
      type: String,
    },
    functionType: {
      type: String,
    },
  },
  { timestamps: true }
);

actionLogSchema.add(baseSchema);

const ActionLog = model<IActionLog>("ActionLog", actionLogSchema);

export default ActionLog;
