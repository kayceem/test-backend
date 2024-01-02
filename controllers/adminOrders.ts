const Category = require("../models/Category");
const Course = require("../models/Course");
const Order = require("../models/Order");
import CustomErrorMessage from '../utils/errorMessage';
import {faker} from '@faker-js/faker'
// const Category = require('../models/category');
import { Request, Response, NextFunction } from "express";


export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { note, paymentMethod, vatFee, shippingFee, courses, user } = req.body;

  try {
    const order = new Order({
      note,
      vatFee: 10,
      shippingFee: 20,
      paymentMethod,
      courses,
      user,
      status: "Waiting to Confirm",
    });

    const response = await order.save();
    // Update qty course at database (-qty);

    res.status(201).json({
      message: "Created order successfully!",
      order: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to post order!", 422);
      return error;
    }
    next(error);
  }
};

export const randomOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find();

    let result = [];

    // Loop to create 20 random orders;
    for (let i = 0; i < 16; i++) {
      const randomMonth = `${Math.ceil(Math.random() * 12)}`.padStart(2, "0");
      const randomHour = `${Math.ceil(Math.random() * 12)}`.padStart(2, "0");

      const orderData: any = {
        note: "Keep it safe please!!!",
        vatFee: 0,
        shippingFee: 0,
        paymentMethod: "COD",
        courses: {
          items: [],
          totalPrice: 0,
        },
        user: {
          email: faker.internet.email({ provider: "gmail" }),
          fullName: faker.person.fullName(),
          phone: faker.phone.number("0#########"),
          shippingAddress: faker.location.streetAddress({ useFullAddress: true }),
        },
        status: "success",
        createdAt: new Date(`2023-${randomMonth}-21T${randomHour}:19:01.014+00:00`),
        updatedAt: new Date(`2023-${randomMonth}-21T${randomHour}:19:01.014+00:00`),
      };

      // Random number courses
      Array.from(new Array(2)).forEach(() => {
        const randNumber = Math.trunc(Math.random() * 12);

        const courseItem = courses[randNumber];

        const course = {
          prodId: courseItem._id,
          qty: 2,
          price: courseItem.oldPrice * (1 - courseItem.discount / 100),
          name: courseItem.name,
          image: courseItem.thumbnail,
        };

        orderData.courses.items.push(course);
      });

      const totalPrice = orderData.courses.items.reduce(
        (acc: any, item: any) => acc + item.price * item.qty,
        0
      );

      orderData.courses.totalPrice = totalPrice;

      // console.log(orderData);

      const orderCreated = new Order(orderData);
      await orderCreated.save();

      result.push(orderData);
    }

    res.status(200).json({
      message: "Successfully!",
      result,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to get random orderss!", 422);
      return error;
    }
    next(error);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    res.status(200).json({
      message: "Get order by id successfully!",
      order,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to get order by id!", 422);
      return error;
    }
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const { courseId, date, searchText } = req.query;

  console.log("course id: ", courseId);
  console.log("date: ", date);
  const currentDate = new Date();

  let previousDays = -1;

  switch (date) {
    case "all":
      previousDays = -1;
      break;
    case "today":
      previousDays = 0;
      break;
    case "yesterday":
      previousDays = 1;
      break;
    case "7days":
      previousDays = 7;
      break;
    case "30days":
      previousDays = 30;
      break;

    default:
      break;
  }
  const previousDaysAgo = new Date(currentDate);
  previousDaysAgo.setDate(previousDaysAgo.getDate() - previousDays);

  // console.log("previous days: ", previousDaysAgo);
  // console.log("current date: ", currentDate);

  try {
    const orderQuery: any = {};

    if (courseId && courseId !== "all") {
      orderQuery["items._id"] = courseId;
    }

    if (previousDays !== -1) {
      previousDaysAgo.setHours(0, 0, 0, 0); // Set time to start of the day

      orderQuery.createdAt = {
        $gte: previousDaysAgo,
        $lte: currentDate,
      };
    }

    if (searchText) {
      orderQuery.$text = {
        $search: searchText,
      };
    }

    console.log("order query: ", orderQuery);

    const orders = await Order.find(orderQuery).populate("user._id", "_id name avatar email phone");

    const result = orders.map((orderItem: any) => {
      return {
        _id: orderItem._id,
        transaction: orderItem.transaction,
        totalPrice: orderItem.totalPrice,
        items: orderItem.items,
        note: orderItem.note,
        user: orderItem.user._id,
        vatFee: orderItem.vatFee,
        createdAt: orderItem.createdAt,
        updatedAt: orderItem.updatedAt,
      };
    });

    res.json({
      message: "fetch all orders successfully!",
      orders: result,
      count: orders.length,
      total: orders.reduce((acc: any, order: any) => acc + order.totalPrice, 0),
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to get order by id!", 422);
      return error;
    }
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;

  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    console.log(order, status);

    order.status = status;

    const newOrder = await order.save();

    res.status(200).json({
      message: "Update order status successfully!",
      orderId,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to update order", 422);
      return error;
    }
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  try {
    const response = await Order.deleteOne({
      _id: orderId,
    });

    res.status(200).json({
      message: "Delete order successfully!",
      orderId: orderId,
      result: response,
    });
  } catch (error) {
    if (!error) {
      const error = new CustomErrorMessage("Failed to delete order!", 422);
      return error;
    }
    next(error);
  }
};

// exports.getInvoices = async (req, res, next) => {};
