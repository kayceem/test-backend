import { Router } from "express";
import * as transactionController from "../../controllers/admin/transaction";

const router = Router();

router.get("/", transactionController.getTransactions);

export default router;
