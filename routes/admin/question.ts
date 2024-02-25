import { Router } from "express";
import uploadMiddleware from "../../middleware/upload";
import * as questionController from "../../controllers/admin/question";

const router = Router();

router.get("/", questionController.getQuestions);

router.get("/question/:questionId", questionController.getQuestionById);

router.post("/question/create", uploadMiddleware.array("images[]"), questionController.postQuestion);

export default router;
