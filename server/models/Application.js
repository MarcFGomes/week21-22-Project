const { Schema } = require('mongoose');

const applicationSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    link: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { _id: true } // keep _id for updates/deletes
);

module.exports = applicationSchema;