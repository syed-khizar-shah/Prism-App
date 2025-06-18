const mongoose = require('mongoose');
const { Schema } = mongoose;

const powerLensMapSchema = new Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  recommendedLenses: [{ type: Schema.Types.ObjectId, ref: "RecommendedLens" }]
}, { _id: false });

const lensSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String },
  description: { type: String },
  ageGroups: [{ type: Schema.Types.ObjectId, ref: "AgeGroup" }],
  powerLensMap: [powerLensMapSchema],
  subtypeOf: { type: Schema.Types.ObjectId, ref: "Lens", default: null },
},{timestamps:true});


module.exports = mongoose.model('Lens', lensSchema);
