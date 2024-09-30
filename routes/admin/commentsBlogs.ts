import express, { Router } from "express";

import * as blogCommentsController from "../../controllers/admin/commentsBlogs";
const router: Router = express.Router();
import isAuth from "../../middleware/is-auth";

// route to create a new comment
router.post("/create", blogCommentsController.addComment);

// route to get all the comments of an article
router.get("/getCommentsByBlogId/:blogId", isAuth, blogCommentsController.getCommentsByBlogId);

// route to update a comment
router.put("/update/:commentId", isAuth, blogCommentsController.updateComment);

// route to delete a comment
router.delete("/:commentId", isAuth, blogCommentsController.deleteComment);

// route to 'like' or 'unlike' a comment
router.patch("/like", isAuth, blogCommentsController.toggleLikeComment);

// route to respond to commentss
router.post("/reply", isAuth, blogCommentsController.addReplyToComment);

// route to get all blog comments
router.get("/getAll", blogCommentsController.getAllBlogComments);

// route to get all the comments of an article (admin)
router.get("/getBlogParams/getBlogParams", isAuth, blogCommentsController.getCommentsBlog);

router.patch(
  "/update-active-status",
  isAuth,
  blogCommentsController.updateActiveCategoryBlogStatus
);

// route to get the history of a blog comments
router.get("/histories/:commentId", isAuth, blogCommentsController.loadHistoriesForCategoryBlog);

export default router;
