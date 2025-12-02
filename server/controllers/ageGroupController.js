const AgeGroup = require('../models/AgeGroupSchema');

// Create AgeGroup
exports.createAgeGroup = async (req, res) => {
  try {
    const ageGroup = new AgeGroup(req.body);
    await ageGroup.save();
    res.status(201).json(ageGroup);
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message });
  }
};

// Get all AgeGroups
exports.getAllAgeGroups = async (req, res) => {
  try {
    const ageGroups = await AgeGroup.find();
    res.json(ageGroups);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};

// Get AgeGroup by ID
exports.getAgeGroupById = async (req, res) => {
  try {
    const ageGroup = await AgeGroup.findById(req.params.id);
    if (!ageGroup) return res.status(404).json({ error: 'Not found' });
    res.json(ageGroup);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};

// Update AgeGroup
exports.updateAgeGroup = async (req, res) => {
  try {
    const ageGroup = await AgeGroup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ageGroup) return res.status(404).json({ error: 'Not found' });
    res.json(ageGroup);
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message });
  }
};

// Delete AgeGroup
exports.deleteAgeGroup = async (req, res) => {
  try {
    const ageGroup = await AgeGroup.findByIdAndDelete(req.params.id);
    if (!ageGroup) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};
