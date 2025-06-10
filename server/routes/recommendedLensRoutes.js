const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendedLensController');

router.post('/', controller.createRecommendedLens);
// router.post('/by-ids', controller.getMultipleRecommendedLensesByIds);

router.get('/', controller.getAllRecommendedLenses);
router.get('/:id', controller.getRecommendedLensById);
router.put('/:id', controller.updateRecommendedLens);
router.delete('/:id', controller.deleteRecommendedLens);

module.exports = router;
