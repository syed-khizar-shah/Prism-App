// controllers/colorController.js
const Color = require('../models/ColorSchema');
const Design = require('../models/DesignSchema'); // make sure to import this if not already


// Create new color
exports.createColor = async (req, res) => {
  try {
    const { name, code } = req.body;
    const color = new Color({ name, code });
    console.log({color})
    await color.save();
    res.status(201).json(color);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all colors
exports.getColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single color by ID
exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) return res.status(404).json({ message: 'Color not found' });
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// update
exports.updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    if (!color) return res.status(404).json({ message: 'Color not found' });
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete color by ID
exports.deleteColor = async (req, res) => {
  try {
    const colorId = req.params.id;

    // Check if the color is referenced in any Extra
    const referencingDesigns = await Design.find({ colors: colorId }, '_id');

    if (referencingDesigns.length > 0) {
      return res.status(409).json({
        message: `Cannot delete. This color is used in ${referencingDesigns.length} design.`,
        references: referencingDesigns.map(e => e._id)
      });
    }

    const result = await Color.findByIdAndDelete(colorId);
    if (!result) return res.status(404).json({ message: 'Color not found' });

    res.json({ message: 'Color deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
