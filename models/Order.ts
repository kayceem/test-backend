import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
export interface IOrder extends IBaseSchema {
  vatFee?: number;
  transaction: {
    method: string;
  };
  note?: string;
  totalPrice?: number;
  user: {
    _id: Schema.Types.ObjectId;
    email: string;
    name: string;
    phone?: string;
  };
  items: {
    _id: Schema.Types.ObjectId;
    finalPrice: number;
    name: string;
    thumbnail: string;
    reviewed?: boolean;
  }[];
  status: string;
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
