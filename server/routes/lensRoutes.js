const express = require('express');
const router = express.Router();
const lensController = require('../controllers/lensController');

router.get('/', lensController.getAllLenses);
router.get('/:id', lensController.getLensById);
router.post('/', lensController.createLens);
router.put('/:id', lensController.updateLens);
router.delete('/:id', lensController.deleteLens);

module.exports = router;
