const mongoose = require('mongoose');
const { Schema } = mongoose;

// TODO: 
// Create 1 schema with optional fields, each lens has a type, and name
// for the 3 varifocal, they have varifocal type
// so when we fetch all the lens we show them by types. and if type is varifocal
// we show the lens having types varifocal.


// extras has both recommended lens and lens as array, so it vary depending on
// these 2

// as bifocal lens has design after recommendedLens and each design has its own extras
// 
// also add age group array in lensSchema

const lensSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String },
  description: { type: String },
  ageGroups: [{type: Schema.Types.ObjectId, ref:"AgeGroup"}],
  powerLensMap: [powerLensMapSchema]
});

const powerLensMapSchema = new Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  recommendedLenses: [recommendedLensSchema]
}, { _id: false });

const recommendedLensSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number, required: true, min: 0 },
});

const designSchema = new Schema({
  lensTypes: [{ type: Schema.Types.ObjectId, ref: 'Lens' }],
  recommendedLenses: [{ type: Schema.Types.ObjectId, ref: 'RecommendedLens' }],
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  coating: [{ type: Schema.Types.ObjectId, ref: 'Coating' }],
  extras:[{type: Schema.Types.ObjectId, ref: 'Extras'}]
});


// use this toooo: 

// const designSchema = new Schema({
//   name: { type: String, required: true }, // "Default" for no-design lenses
//   extras: [{ type: Schema.Types.ObjectId, ref: 'Extra' }]
// });

// const recommendedLensSchema = new Schema({
//   name: { type: String, required: true },
//   designs: { 
//     type: [designSchema], 
//     required: true,
//     validate: v => v.length > 0
//   }
// });
