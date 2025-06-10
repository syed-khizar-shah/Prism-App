const mongoose = require('mongoose');
const { Schema } = mongoose;

const designSchema = new Schema({
  lensType: { type: Schema.Types.ObjectId, ref: 'Lens', required: true  },
  recommendedLens: [{ type: Schema.Types.ObjectId, ref: 'RecommendedLens'}],
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  isVisible: { type: Boolean, default: true },
  coating: [{ type: Schema.Types.ObjectId, ref: 'Coating' }],
  extras: [{
    extra: { type: Schema.Types.ObjectId, ref: 'Extras', required: true },
    colors: [{ type: Schema.Types.ObjectId, ref: 'Color' }] // References to Color documents
  }]});

module.exports = mongoose.model('Design',designSchema)