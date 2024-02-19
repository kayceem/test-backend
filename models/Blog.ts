import { Schema, model, Document } from "mongoose";
import baseSchema from "./BaseSchema";

export interface IBlog extends Document {
  title: string;
  author: string;
  blogImg: string;
  technology: string;
  tags: string[];
  readTime: string;
  datePublished: Date;
  content: string;
  userId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  isDeleted: boolean;
}

// Schema cho Blog
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    blogImg: {
      type: String,
      required: true,
    },
    technology: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    readTime: {
      type: String,
      required: true,
    },
    datePublished: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

blogSchema.add(baseSchema);
blogSchema.index({ title: "text", content: "text" });
export default model<IBlog>("Blog", blogSchema);
