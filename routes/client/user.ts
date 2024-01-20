import { Router } from "express";
import * as userController from "../../controllers/client/user";
import upload from "../../middleware/upload";

const router = Router();

router.get("/authors", userController.getAuthors);

router.get("/user/:userId", userController.getUser);

router.put("/user/:userId", upload.single("avatar"), userController.updateUser);

router.get("/user/detail/:userId", userController.getUserDetail);

export default router;
