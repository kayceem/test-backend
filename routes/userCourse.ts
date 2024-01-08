const express = require("express");
import { Router } from "express";
const router = Router();
const coursesController = require("../controllers/userCourses");

// GET Courses by User
router.get("/coursesByUser/:userId", coursesController.getCoursesByUser);
router.get("/wishlistcoursesByUser/:userId", coursesController.getCoursesWishlistByUser);

export default router;
