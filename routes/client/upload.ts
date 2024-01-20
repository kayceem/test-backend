import { Router } from "express";
import uploadVideoMiddleware from "../../middleware/uploadVideo";
import * as uploadController from "../../controllers/client/upload";

const router = Router();

router.post("/video", uploadVideoMiddleware.single("videoFile"), uploadController.uploadVideo);

export default router;
