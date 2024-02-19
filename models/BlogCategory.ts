import mongoose, { Document, Schema, model, ObjectId } from "mongoose";

export interface ICategoryBlog extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  cateImage: string;
  blogs: ObjectId[]; // Sử dụng ObjectId để tham chiếu đến các Blog
}

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
    blogs: [{
      type: Schema.Types.ObjectId,
      ref: 'Blog', // Tham chiếu đến Model Blog
    }],
  },
  {
    timestamps: true,
  }
);

// Cập nhật chỉ mục để phản ánh đúng các trường trong schema
blogCategorySchema.index({ name: "text", description: "text" });

export default model<ICategoryBlog>("BlogCategory", blogCategorySchema);
