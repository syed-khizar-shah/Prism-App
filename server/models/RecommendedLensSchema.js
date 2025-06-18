const mongoose = require('mongoose');
const { Schema } = mongoose;

const recommendedLensSchema = new Schema({
  code: { type: String, required: true, unique:true },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model('RecommendedLens', recommendedLensSchema);
