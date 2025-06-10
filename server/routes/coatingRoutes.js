const express = require('express');
const router = express.Router();
const coatingController = require('../controllers/coatingController');

router.get('/', coatingController.getAllCoatings);
router.get('/:id', coatingController.getCoatingById);
router.post('/', coatingController.createCoating);
router.put('/:id', coatingController.updateCoating);
router.delete('/:id', coatingController.deleteCoating);

module.exports = router;
