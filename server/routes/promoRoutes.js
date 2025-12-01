const express = require('express');
const {
  createPromo,
  getPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  validatePromo,
  getValidPromos
} = require('../controllers/promoController');

const router = express.Router();

// CRUD routes
router.post('/', createPromo);
router.get('/', getPromos);
router.get('/', getPromos);
router.get('/valid', getValidPromos);
router.get('/:id', getPromoById);
router.put('/:id', updatePromo);
router.delete('/:id', deletePromo);

// Apply/Validate promo code
router.post('/validate', validatePromo);

module.exports = router;