const express = require("express");

import {
  addComment,
  addReplyToComment,
  deleteComment,
  getAllCommentsFromMultipleBlogs,
  getCommentsByBlogId,
  toggleLikeComment,
  updateComment,
} from "../../controllers/client/commentsBlogs";

const router = express.Router();

// route to create a new comment
router.post("/", addComment);

// route to get all the comments of an article
router.get("/:blogId", getCommentsByBlogId);

// route to update a comment
router.put("/:commentId", updateComment);

// route to delete a comment
router.delete("/:commentId", deleteComment);

// route to 'like' or 'unlike' a comment
router.patch("/like", toggleLikeComment);

// route to respond to comments
router.post("/reply", addReplyToComment);


export default router;
