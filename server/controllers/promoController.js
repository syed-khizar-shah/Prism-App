const Promo = require('../models/PromosSchema');

// Create a new promo
const createPromo = async (req, res) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all promos
const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single promo by ID
const getPromoById = async (req, res) => {
  try {
    const promo = await Promo.findById(req.params.id);
    if (!promo) {
      return res.status(404).json({ message: 'Promo not found' });
    }
    res.json(promo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promo
const updatePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promo) {
      return res.status(404).json({ message: 'Promo not found' });
    }
    res.json(promo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a promo
const deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) {
      return res.status(404).json({ message: 'Promo not found' });
    }
    res.json({ message: 'Promo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate/Apply a promo code
const validatePromo = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await Promo.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (!promo) {
      return res.status(404).json({ message: 'Promo code not found or inactive' });
    }

    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) {
      return res.status(400).json({ message: 'Promo code is expired or not yet active' });
    }

    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ message: 'Promo usage limit reached' });
    }

    res.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPromo,
  getPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  validatePromo
};
