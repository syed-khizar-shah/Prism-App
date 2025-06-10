const express = require('express');
const router = express.Router();
const ageGroupController = require('../controllers/ageGroupController');

router.post('/', ageGroupController.createAgeGroup);
router.get('/', ageGroupController.getAllAgeGroups);
router.get('/:id', ageGroupController.getAgeGroupById);
router.put('/:id', ageGroupController.updateAgeGroup);
router.delete('/:id', ageGroupController.deleteAgeGroup);

module.exports = router;
