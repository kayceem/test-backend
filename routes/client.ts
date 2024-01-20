import { Router } from "express";
import courseRouter from "./client/course";
import categoryRouter from "./client/category";
import userRouter from "./client/user";
import orderRouter from "./client/order";
import cartRouter from "./client/cart";
import sectionRouter from "./client/section";
import lessonRouter from "./client/lesson";
import certificateRouter from "./client/certificate";
import uploadRouter from "./client/upload";
import paymentRouter from "./client/payment";

const router = Router();

router.use("/courses", courseRouter);

router.use("/categories", categoryRouter);

router.use("/users", userRouter);

router.use("/orders", orderRouter);

router.use("/carts", cartRouter);

router.use("/sections", sectionRouter);

router.use("/lessons", lessonRouter);

router.use("/certificates", certificateRouter);

router.use("/uploads", uploadRouter);

router.use("/payments", paymentRouter);

export default router;
