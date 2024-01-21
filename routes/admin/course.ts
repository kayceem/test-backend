import { Router } from "express";
import isAuth from "../../middleware/is-auth";
import isOwnerOfCourse from "../../middleware/is-owner-course";
import uploadMiddleware from "../../middleware/upload";
import * as courseController from "../../controllers/admin/course";

const router = Router();

router.get("/", isAuth, courseController.getCourses);

router.get("/course/:courseId", isAuth, courseController.getCourse);

router.post(
  "/course/create",
  isAuth,
  uploadMiddleware.array("images[]"),
  courseController.postCourse
);

router.delete("/course/delete/:courseId", isAuth, isOwnerOfCourse, courseController.deleteCourse);

export default router;
