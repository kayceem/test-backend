import { Router } from "express";
import uploadMiddleware from "../../middleware/upload";
import * as lessonController from "../../controllers/admin/lesson";

const router = Router();

router.get("/", lessonController.getLessons);

router.get("/section/:sectionId", lessonController.getLessonsBySectionId);

router.get("/lesson/:lessonId", lessonController.getLesson);

router.post("/lesson/create", uploadMiddleware.array("images[]"), lessonController.postLesson);

export default router;
