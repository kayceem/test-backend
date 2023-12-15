const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
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
  summary: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  readTime: {
    type: Number,
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
  category: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
