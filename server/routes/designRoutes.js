const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

router.get('/', designController.getAllDesigns);
router.get('/:id', designController.getDesignById);
router.post('/', designController.createDesign);
router.put('/:id', designController.updateDesign);
router.delete('/:id', designController.deleteDesign);

//
router.post('/find-by-lens-pair',designController.getDesignByLensPair)

module.exports = router;
