import { Router } from "express";
import uploadMiddleware from "../../middleware/upload";
import * as sectionController from "../../controllers/admin/section";

const router = Router();

router.get("/", sectionController.getSections);

router.get("/course/:courseId", sectionController.getSectionsByCourseId);

router.get("/section/:sectionId", sectionController.getSection);

router.post("/section/create", uploadMiddleware.array("images[]"), sectionController.postSection);

export default router;
