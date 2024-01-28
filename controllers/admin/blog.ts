import { Request, Response, NextFunction } from "express";
import Blog from "../../models/Blog";
import mongoose from "mongoose";
import CustomErrorMessage from "../../utils/errorMessage";

export const getAllBlog = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
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

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
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
      const error = new CustomErrorMessage("Missing required fields", 400);
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
  } catch (error: any) {
    // Handle errors
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new CustomErrorMessage("Could not find blog", 422);
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

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, blogImg, technology, tags, readTime, content, userId, category } =
    req.body;
  const { id } = req.params;
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

export const deleteBlogById = async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new CustomErrorMessage("Could not find blog", 422);
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

export const softDeleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
