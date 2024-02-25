import { Router } from "express";
import uploadMiddleware from "../../middleware/upload";
import * as questionController from "../../controllers/admin/question";

const router = Router();

/** load question */
router.get("/", questionController.getQuestions);

/** load detail single question */
router.get("/question/:questionId", questionController.getQuestionById);

/** get histories of question */
router.get("/question/:questionId/histories", questionController.loadHistories);

/** create data for question */
router.post("/question/create", uploadMiddleware.array("images[]"), questionController.postQuestion);

/** Update a question */
router.put("/question/update", uploadMiddleware.array("images[]"), questionController.updateQuestion);

/** Update active status question */
router.patch("/question/update_active_status", uploadMiddleware.array("images[]"), questionController.updateActiveStatusQuestion);

export default router;
