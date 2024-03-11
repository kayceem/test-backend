import { Router } from "express";
import * as reviewController from "../../controllers/client/review";
import isUserAuth from "../../middleware/is-user-auth";

const router = Router();

router.post("/review/create", isUserAuth, reviewController.postReview);

export default router;
