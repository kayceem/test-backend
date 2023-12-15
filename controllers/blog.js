const Blog = require("../models/Blog");

exports.getAllBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      message: "Get all blogs successfully",
      blogs: blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.postBlog = async (req, res, next) => {
  const { title, author, blogImg, summary, tags, readTime, datePublished, content, category } =
    req.body;
  try {
    const blog = new Blog({
      title,
      author,
      blogImg,
      summary,
      tags,
      readTime,
      datePublished,
      content,
      category,
    });

    const createdBlog = await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: createdBlog,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBlogById = async (req, res, next) => {
  const blogId = req.params.id;
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

exports.updateBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, author, blogImg, summary, tags, readTime, datePublished, content, category } =
    req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      throw error;
    }
    blog.title = title;
    blog.author = author;
    blog.blogImg = blogImg;
    blog.summary = summary;
    blog.tags = tags;
    blog.readTime = readTime;
    blog.datePublished = datePublished;
    blog.content = content;
    blog.category = category;

    const updatedBlog = await blog.save();

    res.status(200).json({
      message: "Update blog successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
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
