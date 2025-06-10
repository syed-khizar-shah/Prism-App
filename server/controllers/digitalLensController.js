const SingleVisionLens = require('../models/singleVisionLensSchema');

// Create new SingleVisionLens
exports.createLens = async (req, res) => {
  try {
    const lens = new SingleVisionLens(req.body);
    await lens.save();
    res.status(201).json(lens);
  } catch (error) {
    console.log({error})
    res.status(400).json({ error: error.message });
  }
};

// Get all SingleVisionLenses
exports.getAllLenses = async (req, res) => {
  try {
    const lenses = await SingleVisionLens.findOne()
      .populate('powerLensMap.recommendedLenses')
      .populate('powerLensMap.recommendedLenses');
    res.json(lenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single SingleVisionLens by ID
exports.getLensById = async (req, res) => {
  try {
    const lens = await SingleVisionLens.findById(req.params.id)
      .populate('powerLensMap.recommendedLenses')
      .populate('powerLensMap.recommendedLenses');
    if (!lens) return res.status(404).json({ error: 'Lens not found' });
    res.json(lens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update SingleVisionLens by ID
exports.updateLens = async (req, res) => {
  try {
    const lens = await SingleVisionLens.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lens) return res.status(404).json({ error: 'Lens not found' });
    res.json(lens);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete SingleVisionLens by ID
exports.deleteLens = async (req, res) => {
  try {
    const lens = await SingleVisionLens.findByIdAndDelete(req.params.id);
    if (!lens) return res.status(404).json({ error: 'Lens not found' });
    res.json({ message: 'Lens deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
