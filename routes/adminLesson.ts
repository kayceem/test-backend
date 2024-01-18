import express from "express";
import {
  createLesson,
  deleteLesson,
  getAllLessons,
  getLessonsBySectionId,
  getSingleLesson,
  updateLesson,
} from "../controllers/adminLessons";

// const uploadMiddleware = require("../middleware/upload");
// const isAuth = require("../middleware/is-auth");
// const { check, body } = require("express-validator");
const router = express.Router();

// GET Lessons
router.get("/lessons", getAllLessons);

// GET BY RANGES [MIN, MAX];

// router.get("/Lessons-by-price-range", adminLessonController.getLessonsInRange);
// router.get("/random-Lessons", adminLessonController.createRandomLessons);

// GET Lesson

router.get("/lessons/:lessonId", getSingleLesson);

// GET LESSON BY SECTION ID
router.get("/lessons/:sectionId/section", getLessonsBySectionId);

// POST Lesson
router.post(
  "/lesson",
  // uploadMiddleware.array("images[]"),
  createLesson
);

// PUT Lesson
router.put(
  "/lesson/:lessonId",
  // uploadMiddleware.array("images[]"),
  updateLesson
);

// DELETE Lesson
router.delete("/lessons/:lessonId", deleteLesson);

export default router;
