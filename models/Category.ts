// const mongoose = require("mongoose"); // Erase if already required
import { Schema, model, Document } from 'mongoose';
// const Schema = mongoose.Schema;
export interface ICategory {
  name: string;
  description: string;
  cateImage: string;
  cateParent?: string;
  cateSlug?: string;
  // Add other properties as needed
}
// Declare the Schema of the Mongo model
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    cateImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cateParent: {
      type: String,
    },
  },
  { timestamps: true }
);

//  Define the text index on 'name' and 'description' fields
categorySchema.index({ name: "text", description: "text" });

//Export the model
// module.exports = mongoose.model("Category", categorySchema);
export default model<ICategory & Document>('Category', categorySchema);