import { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongodb";

interface ISection extends Document {
  courseId: ObjectId;
  name: string;
  access: string;
  description: string;
  oldPrice: number;
  discount: number;
  images: string;
  thumbnail: string;
  shortDesc: string;
  fullDesc: string;
  stockQty: number;
  categoryId: ObjectId;
}

// Declare the Schema of the Mongo model
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

const Section = model<ISection>("Section", sectionSchema);

export default Section;
