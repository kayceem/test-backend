import { Router } from "express";
import * as feedbackController from "../../controllers/admin/feedback";
import isAuth from "../../middleware/is-auth";
const router = Router();

router.get("/", isAuth, feedbackController.getFeedbacks);

router.get("/feedback/:feedbackId", isAuth, feedbackController.getFeedback);

router.delete('/feedback/delete/:feedbackId', isAuth, feedbackController.deleteFeedback);

export default router;
