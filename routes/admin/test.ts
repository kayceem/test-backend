import { Router } from "express";
import uploadMiddleware from "../../middleware/upload";
import * as testController from "../../controllers/admin/test";

const router = Router();

router.get("/", testController.getTests);

router.get("/test/:testId", testController.getTestById);

router.post("/test/create", uploadMiddleware.array("images[]"), testController.postTest);

export default router;
