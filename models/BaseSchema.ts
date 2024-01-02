const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { discriminatorKey: 'kind' });

module.exports = baseSchema;
