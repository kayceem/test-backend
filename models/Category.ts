import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";

export interface ICategory extends IBaseSchema {
  name: string;
  cateImage: string;
  description: string;
  cateSlug: string;
  cateParent: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    cateImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cateSlug: {
      type: String,
      required: true,
    },
    cateParent: {
      type: String,
    },
  },
  { timestamps: true }
);

categorySchema.add(baseSchema);

categorySchema.index({ name: "text", description: "text" });

const Category = model<ICategory>("Category", categorySchema);

export default Category;
