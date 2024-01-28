import { Router } from "express";
import * as reportController from "../../controllers/admin/report";

const router = Router();

// GET Summary reports
router.get("/summary", reportController.getSummaryReports);

// GET Courses Sales
router.get("/course-sales", reportController.getCourseSales);

// GET Revenue
router.get("/revenues", reportController.getRevenues);

// GET NEW SIGNUPS
router.get("/new-signups", reportController.getNewUserSignups);

// GET REPORTS FOR USER PROGRESS
router.get("/users-progress", reportController.getReportsUserProgress);

// GET REPORTS FOR COURSE INSIGHTS
router.get("/course-insights", reportController.getReportsCourseInsights);

export default router;
