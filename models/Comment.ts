
import { Schema, model, Document } from 'mongoose';

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      // Array of reply comment IDs
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  postId: {
    // ID of the post this comment belongs to
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
},
{ timestamps: true }
);

// Index for text search on content, if needed
commentSchema.index({ content: "text" });

// Pre-save hook to update the timestamp on edit
// commentSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// module.exports = mongoose.model("Comment", commentSchema);
export default model<Document>('Comment', commentSchema);
