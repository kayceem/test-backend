const express = require("express");
const blogController = require("../controllers/blog");
const router = express.Router();

// GET ALL BLOG
router.get("/", blogController.getAllBlog);

// GET a blog by id
router.get("/:id", blogController.getBlogById);

// POST a new blog
router.post("/", blogController.postBlog);

// UPDATE a blog by id
router.put("/:id", blogController.updateBlogById);

// DELETE a blog by id
router.delete("/:id", blogController.deleteBlogById);


module.exports = router;
