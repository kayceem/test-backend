import { Router } from "express";
import * as lessonController from "../../controllers/client/lesson";

const router = Router();

router.get("/section/:sectionId", lessonController.getLessonsBySectionId);

router.get("/section/course-enrolled/:sectionId", lessonController.getLessonsBySectionIdEnrolledCourse);

router.post("/lesson/done/:lessonId", lessonController.updateLessonDoneByUser);

export default router;
