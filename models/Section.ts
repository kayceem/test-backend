import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface ISection extends IBaseSchema {
  courseId: Schema.Types.ObjectId;
  name: string;
  access: string;
  description?: string;
}

const sectionSchema = new Schema<ISection>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    access: {
      type: String, // DRAFT, SOON, FREE, PAID, PUBLIC, PRIVATE
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

sectionSchema.add(baseSchema);

const Section = model<ISection>("Section", sectionSchema);

export default Section;
