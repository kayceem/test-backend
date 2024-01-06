import { Schema, model, Document } from "mongoose";

interface IUser {
  _id: Schema.Types.ObjectId;
  email: string;
  name: string;
  phone?: string;
}

interface IItem {
  _id: Schema.Types.ObjectId;
  finalPrice: number;
  name: string;
  thumbnail: string;
  reviewed: boolean;
}

interface IOrder extends Document {
  vatFee?: number;
  transaction: {
    method: string;
  };
  note?: string;
  totalPrice?: number;
  user: IUser;
  items: IItem[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    // Id: auto genrate!!!
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
          // required: true,
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
//Export the model
// module.exports = mongoose.model("Order", orderSchema);
export default model<IOrder>("Order", orderSchema);
