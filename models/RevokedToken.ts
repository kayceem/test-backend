// models/RevokedToken.js

import { Schema, model, Document } from 'mongoose';


const revokedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: 60 * 60,
    expires: 60 * 60 * 24 * 7, // The token will be automatically removed from the collection after 7 days
  },
});

// module.exports = mongoose.model("RevokedToken", revokedTokenSchema);
export default model<Document>('RevokedToken', revokedTokenSchema);
