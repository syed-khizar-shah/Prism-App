const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number, // total allowed uses (null = unlimited)
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requiredFrames: {
    type: Number,   // e.g. 2 → promo applies only if buying exactly 2 frames
    required: true
  }
}, { timestamps: true }); // createdAt, updatedAt automatically handled

module.exports = mongoose.model('Promo', promoSchema);
