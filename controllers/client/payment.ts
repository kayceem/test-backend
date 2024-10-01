import { Request, Response, NextFunction } from "express";
import { FRONTEND_URL } from "../../config/frontend-domain";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import Coupon from "../../models/Coupon";
import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import Order from "../../models/Order";


export const khalti = async (req: Request, res: Response, next: NextFunction) => {
    
};

