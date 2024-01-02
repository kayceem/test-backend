const express = require("express");
import { Router } from "express";
const paymentController = require("../controllers/payment");
const router = Router();

router.post("/create_vnpayment_url", paymentController.createVnpayUrl);
router.get("/vnpay_return", paymentController.handleVnpayReturn);

module.exports = router;
