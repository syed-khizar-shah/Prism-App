const mongoose = require('mongoose');
const { Schema } = mongoose;

const ageGroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String } // store image URL or path
});

module.exports = mongoose.model('AgeGroup', ageGroupSchema);
