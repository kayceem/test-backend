import { Router } from "express";
import isUserAuth from "../middleware/is-user-auth";
import isAuth from "../middleware/is-auth";
import * as authController from "../controllers/auth";

const router = Router();

router.put("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", isUserAuth, authController.logout);

router.post("/admin/logout", isAuth, authController.adminLogout);

router.post("/google-login", authController.googleLogin);

router.post("/github-login", authController.githubLogin);

router.post("/admin-login", authController.adminLogin);

router.post("/reset", authController.postReset);

router.post("/new-password", authController.postNewPassword);

router.patch("/:userId/last-login", authController.updateLastLogin);

export default router;
