const Blog = require("../models/Blog");
const mongoose = require("mongoose");

exports.getAllBlog = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find().skip(skip).limit(limit);
    const total = await Blog.countDocuments();

    res.status(200).json({
      message: "Get all blogs successfully",
      blogs: blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

exports.createBlog = async (req, res, next) => {
  const { title, author, blogImg, technology, tags, readTime, content, userId, category } =
    req.body;
  console.log(req.body);
  try {
    if (
      !title ||
      !author ||
      !blogImg ||
      !technology ||
      !tags ||
      !readTime ||
      !content ||
      !userId ||
      !category
    ) {
      const error = new Error("Missing required fields");
      error.statusCode = 400;
      throw error;
    }

    // Create a new blog post instance
    const blogPost = new Blog({
      title,
      author,
      blogImg,
      technology,
      tags,
      readTime,
      datePublished: Date.now(), // Use current date
      content,
      userId, // Use the corrected variable name
      category,
    });

    // Save the blog post to the database
    await blogPost.save();

    res.status(201).json({
      message: "Blog post created successfully",
      blogPost,
    });
  } catch (error) {
    // Handle errors
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};

exports.getBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Get blog successfully",
      blog: blog,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  const { title, author, blogImg, technology, tags, readTime, content, userId, category } =
    req.body;
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
  try {
    // Find the blog post by id and update it
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        author,
        blogImg,
        technology,
        tags,
        readTime,
        content,
        userId,
        category,
      },
      { new: true }
    ); // The { new: true } option returns the updated document
    // If the blog post was not found, send a 404 error
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    // Send the updated blog post in the response
    res.json(updatedBlog);
  } catch (err) {
    // If there's an error, pass it to the error handling middleware
    next(err);
  }
};

exports.deleteBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      throw error;
    }
    await Blog.findByIdAndRemove(blogId);
    res.status(200).json({
      message: "Delete blog successfully",
    });
  } catch (error) {
    next(error);
  }
};
