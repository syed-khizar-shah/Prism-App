// models/FrameSummary.js
const mongoose = require('mongoose');

const frameFieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // e.g. "Frame Model", "Frame Price"
    },
    type: {
        type: String,
        enum: ['text', 'number', 'select'],
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

// There should only ever be one FrameSummary document.
// Prevent creation of multiple FrameSummary documents by using a fixed _id.
const FRAME_SUMMARY_SINGLETON_ID = 'framesummary';

const frameSummarySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: FRAME_SUMMARY_SINGLETON_ID
    },
    fields: {
        type: [frameFieldSchema],
        default: [
            { name: 'Frame Model', type: 'text', required: true, isActive: true, order: 1 },
            { name: 'Frame Price', type: 'number', required: true, isActive: true, order: 2 }
        ]
    },
}, { timestamps: true });

module.exports = mongoose.model('FrameSummary', frameSummarySchema);
