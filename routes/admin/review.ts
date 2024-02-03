import { Router } from "express";
import * as reviewController from "../../controllers/admin/review";

const router = Router();

router.get("/", reviewController.getReviews);

router.get("/review/:reviewId", reviewController.getReview);

router.delete('/review/delete/:reviewId', reviewController.deleteReview);

export default router;