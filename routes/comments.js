const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments");

router.post("/", commentController.createComment);
router.get("/:postId", commentController.getComments);
router.put("/:postId", commentController.updateComment);
router.delete("/:postId", commentController.deleteComment);
router.post("/:postId/like", commentController.likeComment);

module.exports = router;
