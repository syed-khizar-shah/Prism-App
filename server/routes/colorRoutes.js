// routes/colorRoutes.js
const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');

// POST /api/colors
router.post('/', colorController.createColor);

// GET /api/colors
router.get('/', colorController.getColors);

// GET /api/colors/:id
router.get('/:id', colorController.getColorById);

// update
router.put('/:id', colorController.updateColor);


// DELETE /api/colors/:id
router.delete('/:id', colorController.deleteColor);

module.exports = router;
