import { Request, Router } from 'express';
const express = require("express");
// const uploadMiddleware = require("../middleware/upload");
const { check, body } = require("express-validator");
import * as uploadMiddleware from '../middleware/upload';
// const adminCategoriesController = require("../controllers/adminCategories");
import * as adminCategoriesController from '../controllers/adminCategories';
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
// const Category = require("../models/Category");
// import isAuth from "../middleware/is-auth";
// import isAdmin from "../middleware/is-admin";
import Category from '../models/Category';

const router = express.Router();

// GET CATEGORIES
// Is Auth to protect the route
router.get("/categories", isAuth, adminCategoriesController.getCategories);

// GET ALL CATEGORIES
router.get("/all-categories", adminCategoriesController.getAllCategories);

// GET CATEGORY
router.get("/categories/:categoryId/single", isAuth, adminCategoriesController.getCategory);

// POST CATE
// Should put the middleware upload multer here at route
router.post(
  "/category",
  isAuth,
  isAdmin,
  // (uploadMiddleware as any).single("cateImage"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Please enter a input field category with at least 3 characters.")
    .custom((value: string, { req }: {req: Request}) => {

      return Category.findOne({ name: value }).then((categoryDoc: any) => {
        if (categoryDoc) {
          return Promise.reject("Category exists already, please pick a different one.");
        }
      });
    }),
  adminCategoriesController.postCategory
);

// PUT CATE
router.put(
  "/category/:categoryId",
  isAuth,
  isAdmin,
  // (uploadMiddleware as any).single("cateImage"),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Please enter a input field category with at least 3 characters."),
  // .custom((value, { req }) => {
  //   return Category.findOne({ name: value }).then((categoryDoc) => {
  //     if (categoryDoc) {
  //       return Promise.reject("Category exists already, please pick a different one.");
  //     }
  //   });
  // }),
  adminCategoriesController.updateCategories
);

// DELETE CATE
router.delete("/categories/:categoryId", isAuth, isAdmin, adminCategoriesController.deleteCategory);

module.exports = router;
