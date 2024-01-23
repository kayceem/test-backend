import { Router } from "express";
import * as orderController from "../../controllers/admin/order";

const router = Router();

router.get("/", orderController.getOrders);

export default router;