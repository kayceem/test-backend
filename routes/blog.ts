const express = require("express");
import { Router } from "express";
const blogController = require("../controllers/blog");
const router = Router();

// GET ALL BLOG
router.get("/", blogController.getAllBlog);

// GET a blog by id
router.get("/:id", blogController.getBlogById);

// POST a new blog
router.post("/", blogController.createBlog);

// PUT a blog by id
router.put("/create-blog/:id", blogController.updateBlog);

// DELETE a blog by id
router.delete("/:id", blogController.deleteBlogById);

module.exports = router;
