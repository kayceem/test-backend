import { Router } from "express";
import * as cartController from "../../controllers/client/cart";

const router = Router();

router.get("/retrieve", cartController.retrieveCartByIds);

export default router;
