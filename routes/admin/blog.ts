const express = require("express");
import { Router } from "express";
import * as blogController from "../../controllers/admin/blog";
const router = Router();

// GET ALL BLOGS
router.get("/", blogController.getAllBlog);

// GET a blog by id
router.get("/:id", blogController.getBlogById);

// POST a new blog
router.post("/create", blogController.createBlog);

// UPDATE a blog by id
router.put("/update/:id", blogController.updateBlog);

// DELETE a blog by id
router.delete("/delete/:id", blogController.deleteBlogById);

router.put("/:id/soft-delete", blogController.softDeleteBlog);

export default router;
