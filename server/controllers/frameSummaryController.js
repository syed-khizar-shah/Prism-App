const FrameSummary = require("../models/FrameSummarySchema");

/**
 * Create a new Frame Summary
 */
exports.createFrameSummary = async (req, res) => {
  try {
    const frameSummary = new FrameSummary(req.body);
    await frameSummary.save();
    res.status(201).json(frameSummary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all Frame Summaries
 */
exports.getFrameSummaries = async (req, res) => {
  try {
    const summaries = await FrameSummary.find().sort({ sectionOrder: 1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single Frame Summary by ID
 */
exports.getFrameSummaryById = async (req, res) => {
  try {
    const summary = await FrameSummary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a Frame Summary (full update)
 */
exports.updateFrameSummary = async (req, res) => {
  try {
    const summary = await FrameSummary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a Frame Summary
 */
exports.deleteFrameSummary = async (req, res) => {
  try {
    const summary = await FrameSummary.findByIdAndDelete(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    res.json({ message: 'FrameSummary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new field to an existing Frame Summary
 */
exports.addField = async (req, res) => {
  try {
    const summary = await FrameSummary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    summary.fields.push(req.body); // expects { name, type, required, isActive, order, options }
    await summary.save();
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a specific field in Frame Summary
 */
exports.updateField = async (req, res) => {
  try {
    const summary = await FrameSummary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }

    const field = summary.fields.id(req.params.fieldIndex);
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    Object.assign(field, req.body); // update only provided properties
    await summary.save();
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Remove a field from Frame Summary
 */
exports.removeField = async (req, res) => {
  try {
    const summary = await FrameSummary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    summary.fields.splice(req.params.fieldIndex, 1); // remove by index
    await summary.save();
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
