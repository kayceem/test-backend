const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments");

router.post("/comments", commentController.createComment);
router.get("/comments/:postId", commentController.getComments);
router.put("/comments/:postId", commentController.updateComment);
router.delete("/comments/:postId", commentController.deleteComment);
router.post("/comments/:postId/like", commentController.likeComment);

module.exports = router;
