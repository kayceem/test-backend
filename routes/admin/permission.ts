import { Router } from "express";
import * as permissionController from "../../controllers/admin/permission";
const router = Router();

router.get("/", permissionController.getPermissions);

// router.get("/course/:courseId", isAuth, permissionController.getCourse);

// router.post(
//   "/course/create",
//   isAuth,
//   uploadMiddleware.array("images[]"),
//   permissionController.postCourse
// );

// router.delete("/course/delete/:courseId", isAuth, permissionController.deleteCourse);

export default router;
