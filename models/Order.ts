import { Schema, model } from "mongoose";
import { ICourse } from "./Course";
import { IUser } from "./User";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IOrder extends IBaseSchema {
  vatFee?: number;
  transaction: ITransaction;
  note?: string;
  totalPrice?: number;
  user: IUser;
  items: ICourse[];
  status: string;
}

export interface IOrderItem {
  courseId: string;
  name?: string;
  finalPrice?: number;
  thumbnail?: string;
  reviewed?: boolean;
}

export interface ITransaction {
  method: string;
  amount?: number;
  bankCode?: string;
  bankTranNo?: string;
  cardType?: string;
  payDate?: Date;
  orderInfo?: string;
  transactionNo?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    vatFee: {
      type: Number,
    },
    transaction: {
      method: {
        type: String,
        required: true,
        default: "COD",
      },
      amount: {
        type: Number,
      },
      bankCode: {
        type: String,
      },
      bankTranNo: {
        type: String,
      },
      cardType: {
        type: String,
      },
      payDate: {
        type: Date,
      },
      orderInfo: {
        type: String,
      },
      transactionNo: {
        type: String,
      },
    },
    note: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },

    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
        finalPrice: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
          required: true,
        },
        reviewed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

orderSchema.add(baseSchema);

orderSchema.index(
  {
    "user.name": "text",
    "user.email": "text",
    "items.name": "text",
  },
  {
    name: "order_text_index",
  }
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;
