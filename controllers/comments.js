const Comment = require("../models/Comment");
const mongoose = require("mongoose");

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid postId" });
    }

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const newComment = new Comment({
      content: content,
      postId: postId,
      userId: userId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({ error: "postId is required" });
  }
  try {
    const comments = await Comment.find({ postId: postId }).populate("_id");
    if (!comments.length) {
      return res.status(404).json({ error: "No comments found for this post" });
    }
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;

    const comment = await Comment.findById(postId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;
    await Comment.findByIdAndDelete(postId);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a comment
// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const postId = req.params.postId; // Get the comment's ID from the request parameters
    const comment = await Comment.findById(postId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    const userId = comment.userId; // Get the user's ID from the comment

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      // If the user has already liked the comment, remove their like
      comment.likes.pull(userId);
    } else {
      // If the user has not liked the comment, add their like
      comment.likes.push(userId);
    }
    // Save the updated comment
    await comment.save();
    // Send the updated comment as the response
    res.json(comment);
  } catch (error) {
    // If there was an error, send it as the response
    res.status(500).json({ error: error.message });
  }
};
