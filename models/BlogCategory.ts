import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  cateImage: string;
}

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true, // remove this line if description should not be required
    },
    cateImage: {
      type: String,
      required: true, // remove this line if cateImage should not be required
    },
  },
  {
    timestamps: true,
  }
);

let Category: Model<ICategory> | undefined;
if (mongoose.models.Category) {
  Category = mongoose.model<ICategory>("Category");
} else {
  Category = mongoose.model<ICategory>("Category", categorySchema);
}

export default Category;
