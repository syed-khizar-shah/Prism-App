const express = require('express')
const frameSummaryController = require('../controllers/frameSummaryController.js');

const router = express.Router();

// CRUD for whole Frame Summary
router.post('/', frameSummaryController.createFrameSummary);
router.get('/', frameSummaryController.getFrameSummaries);
router.get('/:id', frameSummaryController.getFrameSummaryById);
router.put('/:id', frameSummaryController.updateFrameSummary);
router.delete('/:id', frameSummaryController.deleteFrameSummary);

// Field-specific routes
router.post('/:id/fields', frameSummaryController.addField);
router.put('/:id/fields/:fieldIndex', frameSummaryController.updateField);
router.delete('/:id/fields/:fieldIndex', frameSummaryController.removeField);

module.exports = router;
