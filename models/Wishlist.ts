
import { Schema, model, Document } from 'mongoose';

// Declare the Schema of the Mongo model

const wishlistSchema = new Schema(
  {
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
      },
    ],
  },
  { timestamps: true }
);

wishlistSchema.index(
  {
    "user.name": "text",
    "user.email": "text",
    "items.name": "text",
  },
  {
    name: "wishlist_text_index",
  }
);
//Export the model
// module.exports = mongoose.model("Wishlist", wishlistSchema);
export default model<Document>('Wishlist', wishlistSchema);
