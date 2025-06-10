const mongoose = require('mongoose');
const { Schema } = mongoose;

const extrasSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
});
module.exports = mongoose.model('Extras', extrasSchema);
