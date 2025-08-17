const express = require('express')
const frameSummaryController = require('../controllers/frameSummaryController.js');

const router = express.Router();

// Main Frame Summary routes (singleton)
router.get('/', frameSummaryController.getFrameSummary); // Get the singleton
router.get('/all', frameSummaryController.getFrameSummaries); // Get all (for backward compatibility)
router.post('/', frameSummaryController.createFrameSummary); // Create/Update the singleton
router.put('/', frameSummaryController.updateFrameSummary); // Update the singleton
router.delete('/', frameSummaryController.deleteFrameSummary); // Delete the singleton

// Legacy routes with ID (for backward compatibility)
router.get('/:id', frameSummaryController.getFrameSummaryById);

// Field-specific routes (work with singleton)
router.post('/fields', frameSummaryController.addField);
router.put('/fields/:fieldIndex', frameSummaryController.updateField);
router.delete('/fields/:fieldIndex', frameSummaryController.removeField);
router.put('/fields/reorder', frameSummaryController.reorderFields);

module.exports = router;
