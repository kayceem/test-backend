import mongoose, { Document, Schema, model, ObjectId } from "mongoose";
import { ICategoryBlog } from "../types/iCategoryBlog";
import baseSchema from "./BaseSchema";

const blogCategorySchema = new Schema<ICategoryBlog>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    cateImage: {
      type: String,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog", // Tham chiếu đến Model Blog
      },
    ],
  },
  {
    timestamps: true,
  }
);

blogCategorySchema.add(baseSchema);

blogCategorySchema.index({ name: "text", description: "text" });

export default model<ICategoryBlog>("BlogCategory", blogCategorySchema);
