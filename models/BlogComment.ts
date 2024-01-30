import mongoose, { Document, Schema } from "mongoose";

interface IReply {
  content: string;
  userId: string;
  parentCommentId: string;
}

interface IComment extends Document {
  content: string;
  userId: string;
  postId: string;
  likes: string[];
  parentCommentId?: mongoose.Types.ObjectId;
  replies: IReply[];
}

const replySchema = new Schema<IReply>(
  {
    content: String,
    userId: String,
    parentCommentId: String,
  },
  { _id: false }
);

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Thay đổi "Blog" thành "Post" nếu tên model bài viết của bạn là "Post"
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // Mặc định là null để biết đây là bình luận chính, không phải phản hồi
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: {
      type: [replySchema],
      default: [], // Ensure this is always initialized as an array
    },
  },
  {
    timestamps: true, // Sử dụng timestamps để tự động quản lý trường createdAt và updatedAt
  }
);

commentSchema.index({ content: "text" });

export default mongoose.model<IComment>("Comment", commentSchema);
