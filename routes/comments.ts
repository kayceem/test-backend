const express = require("express");

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  replyComment,
} from "../controllers/comments";

const router = express.Router();

// Route để tạo một bình luận mới
router.post("/", createComment);

// Route để lấy tất cả bình luận của một bài viết
router.get("/:postId", getComments);

// Route để cập nhật một bình luận
router.put("/:commentId", updateComment);

// Route để xóa một bình luận
router.delete("/:commentId", deleteComment);

// Route để 'like' hoặc 'unlike' một bình luận
router.patch("/like/:commentId", likeComment);

// Route để phản hồi bình luận
router.post("/reply/:commentId", replyComment);

export default router;
