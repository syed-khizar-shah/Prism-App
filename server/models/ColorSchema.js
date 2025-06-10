const mongoose = require('mongoose');
const { Schema } = mongoose;

const colorSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }
});

module.exports = mongoose.model('Color', colorSchema);
