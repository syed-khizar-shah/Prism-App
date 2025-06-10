const Extras = require('../models/ExtrasSchema');
const Design = require('../models/DesignSchema')

exports.getAllExtras = async (req, res) => {
  try {
    const extras = await Extras.find();
    res.json(extras);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getExtraById = async (req, res) => {
  try {
    const extra = await Extras.findById(req.params.id);
    if (!extra) return res.status(404).json({ error: 'Not found' });
    res.json(extra);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
};

exports.createExtra = async (req, res) => {
  try {
    const newExtra = new Extras(req.body);
    const saved = await newExtra.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.updateExtra = async (req, res) => {
  try {
    const updated = await Extras.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data or ID' });
  }
};

exports.deleteExtra = async (req, res) => {
  try {
    const extraId = req.params.id;

    // // check references in design schema
    // const referencingDesigns = await Design.find({extras: extraId}, '_id');

    // if (referencingDesigns.length > 0) {
    //   return res.status(409).json({
    //     message: `Cannot delete. This extra is used in ${referencingDesigns.length} designs.`,
    //     references: referencingDesigns.map(e => e._id)
    //   });
    // }
  
    const deleted = await Extras.findByIdAndDelete(extraId);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: 'Invalid ID' });
  }
};
