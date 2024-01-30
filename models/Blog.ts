import { Schema, model, Document } from "mongoose";

const blogSchema = new Schema(
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
      ref: "Category",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", content: "text" });
// module.exports = mongoose.model("Blog", blogSchema);
export default model<Document>("Blog", blogSchema);
