import { Router } from "express";

import * as courseController from "../../controllers/client/course";

const router = Router();

router.get("/", courseController.getCourses);

router.get("/popular", courseController.getPopularCourses);

router.get("/related/:courseId", courseController.getRelatedCourses);

router.get("/suggested/:userId", courseController.getSuggestedCourses);

router.get("/ordered/:userId", courseController.getCoursesOrderedByUser);

router.get("/course/:courseId", courseController.getCourse);

router.get("/course/enrolled/:courseId", courseController.getCourseEnrolledByUserId);

router.get("/course/detail/:courseId", courseController.getCourseDetail);

router.post("/course/reviews/:courseId", courseController.postReview);

export default router;
