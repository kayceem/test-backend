import { Request, Response, NextFunction } from "express";
import Order from "../../models/Order";
import CustomError from "../../utils/error";
import CustomErrorMessage from "../../utils/errorMessage";

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = (req.query._q as string) || "";

    const query = {
      status: "Success",
      totalPrice: { $gt: 0 },
      ...(searchTerm ? { "user.name": { $regex: searchTerm, $options: "i" } } : {}),
    };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .select("transaction _id user")
      .populate("user", "name email");

    const transactions = orders.map((order) => ({
      orderId: order._id,
      user: order.user,
      transaction: order.transaction,
    }));

    res.status(200).json({
      message: "Fetch transactions successfully!",
      transactions,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      const customError = new CustomErrorMessage("Failed to fetch transactions!", 422);
      return next(customError);
    }
  }
};
