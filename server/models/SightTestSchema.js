const mongoose = require("mongoose");
const { Schema } = mongoose;

const sightTestSchema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
    options: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
        }
    ],
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("SightTest", sightTestSchema);