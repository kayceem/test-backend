import { Router } from "express";
import * as paymentController from "../../controllers/client/payment";

const router = Router();

router.post("/khalti", paymentController.khalti);

export default router;
