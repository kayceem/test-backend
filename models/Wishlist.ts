import { Schema, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";

export interface IWishlist extends IBaseSchema {
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.add(baseSchema);

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
