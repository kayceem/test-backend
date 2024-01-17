import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";

export interface ICategory extends IBaseSchema {
  name: string;
  image: string;
  description: string;
  slug: string;
  parent: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
    },
  },
  { timestamps: true }
);

categorySchema.add(baseSchema);

categorySchema.index({ name: "text", description: "text" });

const Category = model<ICategory>("Category", categorySchema);

export default Category;
