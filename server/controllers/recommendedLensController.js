const RecommendedLens = require('../models/RecommendedLensSchema');

// Create
exports.createRecommendedLens = async (req, res) => {
  try {
    const lens = new RecommendedLens(req.body);
    await lens.save();
    res.status(201).json(lens);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
exports.getAllRecommendedLenses = async (req, res) => {
  try {
    const lenses = await RecommendedLens.find();
    res.json(lenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read multiple by ids
// exports.getMultipleRecommendedLensesByIds = async (req, res) => {
//   try {
//     const { ids } = req.body;
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ error: "No IDs provided" });
//     }

//     const lenses = await RecommendedLens.find({ _id: { $in: ids } });
//     res.json(lenses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// Read one
exports.getRecommendedLensById = async (req, res) => {
  try {
    const lens = await RecommendedLens.findById(req.params.id);
    if (!lens) return res.status(404).json({ error: 'Not found' });
    res.json(lens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateRecommendedLens = async (req, res) => {
  try {
    const lens = await RecommendedLens.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lens) return res.status(404).json({ error: 'Not found' });
    res.json(lens);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteRecommendedLens = async (req, res) => {
  try {
    const lens = await RecommendedLens.findByIdAndDelete(req.params.id);
    if (!lens) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
