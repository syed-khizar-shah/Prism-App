const Coating = require('../models/CoatingSchema');

exports.getAllCoatings = async (req, res) => {
  try {
    const coatings = await Coating.find();
    res.json(coatings);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCoatingById = async (req, res) => {
  try {
    const coating = await Coating.findById(req.params.id);
    if (!coating) return res.status(404).json({ error: 'Not found' });
    res.json(coating);
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Invalid ID' });
  }
};

exports.createCoating = async (req, res) => {
  try {
    const newCoating = new Coating(req.body);
    const saved = await newCoating.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.updateCoating = async (req, res) => {
  try {
    const updated = await Coating.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Invalid data or ID' });
  }
};

exports.deleteCoating = async (req, res) => {
  try {
    const deleted = await Coating.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Invalid ID' });
  }
};
