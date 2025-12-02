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

const getValidPromos = async (req, res) => {
  try {
    const promos = await Promo.find({ isActive: true });

    const now = new Date();

    const validPromos = promos.filter(promo => {
      const dateValid = promo.startDate <= now && promo.endDate >= now;

      const usageValid =
        promo.usageLimit === null || promo.usedCount < promo.usageLimit;

      return dateValid && usageValid;
    });

    res.json(validPromos);
  } catch (error) {
    console.error(error)
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
        console.error(error)
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
        console.error(error)
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
        console.error(error)
    res.status(500).json({ message: error.message });
  }
};

// Validate/Apply a promo code
const validatePromo = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.json({ valid: false, message: 'Promo code is required' });
    }

    const promo = await Promo.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (!promo) {
      return res.json({ valid: false, message: 'Promo code not found or inactive' });
    }

    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) {
      return res.json({ valid: false, message: 'Promo code is expired or not yet active' });
    }

    if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) {
      return res.json({ valid: false, message: 'Promo usage limit reached' });
    }

    // Promo is valid
    return res.json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ valid: false, message: 'Internal server error' });
  }
};


module.exports = {
  createPromo,
  getPromos,
  getValidPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  validatePromo
};
