// models/FrameSummary.js
const mongoose = require('mongoose');

const frameFieldSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true // e.g. "Frame Model", "Frame Price"
    },
    type: {
        type: String,
        enum: ['text', 'number', 'select','boolean','date'],
        default: 'text'
    },
    required: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 1
    },
    options: {
        type: [String], // Only used when type = 'select'
        default: []
    }
}, { _id: false });


const frameSummarySchema = new mongoose.Schema({
    fields: {
        type: [frameFieldSchema],
        default: [
            { name: 'Frame Model', type: 'text', required: true, isActive: true, order: 1 },
            { name: 'Frame Price', type: 'number', required: true, isActive: true, order: 2 }
        ]
    },
}, { timestamps: true });

module.exports =  mongoose.model('FrameSummary', frameSummarySchema);
