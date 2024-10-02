import { Request, Response, NextFunction } from "express";
import Order from "../../models/Order";
import { IOrderItem } from "../../types/order.type";
import Course from "../../models/Course";
import { randomBytes } from "crypto";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";
import { coreHelper } from "../../utils/coreHelper";

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      const error = new CustomError("Order", "Order not found", 404);
      throw error;
    }

    res.status(200).json({
      message: "Get order by id successfully!",
      order,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to get order by id!", 422);
      return next(customError);
    }
  }
};

export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { note, transaction, vatFee, items, user, totalPrice, couponCode } = req.body;

  let status: string;

  if (transaction.method === "Khalti") {
    status = "Success";
  }else{
    status = totalPrice === 0 ? "Success" : "Pending";
  }
  try{
  let updatedTransaction = {
        method: transaction.method,
      };

    const courses = await Course.find({
      _id: {
        $in: items.map((item: IOrderItem) => item.courseId),
      },
    });

    const order = new Order({
      note,
      vatFee,
      totalPrice,
      transaction: updatedTransaction,
      couponCode,
      items: courses,
      user,
      status,
    });

    const response = await order.save();
    // if (transaction.method === "Khalti") {
    //   const formData = {
    //     amount: totalPrice,
    //     failure_url: FRONTEND_URL,
    //     product_delivery_charge: "0",
    //     product_service_charge: "0",
    //     product_code: "EPAYTEST",
    //     signature: coreHelper.createSignature(`total_amount=${order.totalPrice},transaction_uuid=${order._id},product_code=EPAYTEST`),
    //     signed_field_names: "total_amount,transaction_uuid,product_code",
    //     success_url: `${BACKEND_URL}/`,
    //     tax_amount: totalPrice*0.1,
    //     total_amount: totalPrice,
    //     transaction_uuid: order._id,
    //   };
    // }
    res.status(201).json({
      message: "Created order successfully!",
      order: response,
      // formData: formData
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to post order", 422);
      return next(customError);
    }
  }
  };

export const getOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;

    const userId: string = req.params.userId;
    const totalItems: number = await Order.countDocuments({ "user._id": userId });
    const orders = await Order.find({ "user._id": userId, status: "Success" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Orders fetched successfully!",
      orders,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to get order by user id!", 422);
      return next(customError);
    }
  }
};
