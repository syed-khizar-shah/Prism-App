const express = require('express');
const {
  createPromo,
  getPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  validatePromo
} = require('../controllers/promoController');

const router = express.Router();

// CRUD routes
router.post('/', createPromo);
router.get('/', getPromos);
router.get('/:id', getPromoById);
router.put('/:id', updatePromo);
router.delete('/:id', deletePromo);

// Apply/Validate promo code
router.post('/validate', validatePromo);

module.exports = router;