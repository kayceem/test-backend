import { Schema, model, Document } from 'mongoose';

// Declare the Schema of the Mongo model
const lessonSchema = new Schema(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Section",
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    icon: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String, // Link youtube
      required: true,
    },
    videoLength: {
      type: Number,
    },
    access: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

//Export the model
// module.exports = mongoose.model("Lesson", lessonSchema);
export default model<Document>('Lesson', lessonSchema);