import { Router } from "express";
import * as feedbackController from "../../controllers/admin/feedback";

const router = Router();

router.get("/", feedbackController.getFeedbacks);

router.get("/feedback/:feedbackId", feedbackController.getFeedback);

router.delete('/feedback/delete/:feedbackId', feedbackController.deleteFeedback);

export default router;
