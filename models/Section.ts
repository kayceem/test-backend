import { Schema, model, Document } from 'mongoose';

// Declare the Schema of the Mongo model
const sectionSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    access: {
      type: String, // DRAFT, SOON, FREE, PAID, PUBLIC, PRIVATE
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

//Export the model
// module.exports = mongoose.model("Section", sectionSchema);
export default model<Document>('Section', sectionSchema);
