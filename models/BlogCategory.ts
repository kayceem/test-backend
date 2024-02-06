import mongoose, { Document, Schema, Model, model, ObjectId } from "mongoose";

export interface ICategory extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  cateImage: string;
  blogs: string[]; // Thêm trường blogs vào đây
}

const blogCategorySchema: Schema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

blogCategorySchema.index({ title: "text", content: "text" });

export default model<Document>("BlogCategory", blogCategorySchema);
