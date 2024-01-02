// const express = require("express");
// const adminCourseController = require("../controllers/adminCourses");
// const uploadMiddleware = require("../middleware/upload");
import * as express from 'express'; // Import express using ES6-style import
// import * as adminCourseController from '../controllers/adminCourses';
import * as adminCourseController from '../controllers/adminCourses';
import * as uploadMiddleware from '../middleware/upload';

// Use the imported variables as needed in the rest of the code


const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
// import isAuth from "../middleware/is-auth";
// import isAdmin from "../middleware/is-admin";
const isOwnerOfCourse = require("../middleware/is-owner-course");
const router = express.Router();
const { check, body } = require("express-validator");

// GET Courses
router.get("/courses", isAuth, adminCourseController.getCourses);

// GET BY RANGES [MIN, MAX];

// router.get("/courses-by-price-range", adminCourseController.getcoursesInRange);
router.get("/random-courses", isAuth, isAdmin, adminCourseController.createRandomCourses);

// GET Course

router.get("/courses/:courseId", isAuth, adminCourseController.getCourse);

// POST Course
router.post(
  "/course",
  isAuth,
  //  (uploadMiddleware as any).array("images[]"),
  adminCourseController.postCourse
);

// PUT Course
router.put(
  "/course/:courseId",
  // (uploadMiddleware as any).array("images[]"),
  adminCourseController.updateCourse
);

// DELETE Course
router.delete("/courses/:courseId", isAuth, isOwnerOfCourse, adminCourseController.deleteCourse);

module.exports = router;
