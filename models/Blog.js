const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema(
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
    category: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", content: "text" });
module.exports = mongoose.model("Blog", blogSchema);
