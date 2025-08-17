const FrameSummary = require("../models/FrameSummarySchema");

const FRAME_SUMMARY_SINGLETON_ID = 'framesummary';

/**
 * Get the Frame Summary singleton
 */
exports.getFrameSummary = async (req, res) => {
  try {
    let summary = await FrameSummary.findById(FRAME_SUMMARY_SINGLETON_ID);
    
    // If no summary exists, create the default one
    if (!summary) {
      summary = new FrameSummary();
      await summary.save();
    }
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all Frame Summaries (for backward compatibility, but should only return one)
 */
exports.getFrameSummaries = async (req, res) => {
  try {
    const summaries = await FrameSummary.find().sort({ createdAt: 1 });
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
 * Create/Update the Frame Summary singleton
 */
exports.createFrameSummary = async (req, res) => {
  try {
    // Since this is a singleton, we'll upsert instead of creating new
    const summary = await FrameSummary.findByIdAndUpdate(
      FRAME_SUMMARY_SINGLETON_ID,
      req.body,
      { 
        new: true, 
        runValidators: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    res.status(201).json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update the Frame Summary singleton
 */
exports.updateFrameSummary = async (req, res) => {
  try {
    const summary = await FrameSummary.findByIdAndUpdate(
      FRAME_SUMMARY_SINGLETON_ID,
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
 * Delete the Frame Summary (resets to default)
 */
exports.deleteFrameSummary = async (req, res) => {
  try {
    const summary = await FrameSummary.findByIdAndDelete(FRAME_SUMMARY_SINGLETON_ID);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    res.json({ message: 'FrameSummary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new field to the Frame Summary
 */
exports.addField = async (req, res) => {
  try {
    let summary = await FrameSummary.findById(FRAME_SUMMARY_SINGLETON_ID);
    
    // If no summary exists, create the default one
    if (!summary) {
      summary = new FrameSummary();
    }
    
    // Add the new field with proper order
    const newField = {
      ...req.body,
      order: summary.fields.length + 1
    };
    
    summary.fields.push(newField);
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
    const summary = await FrameSummary.findById(FRAME_SUMMARY_SINGLETON_ID);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }

    const fieldIndex = parseInt(req.params.fieldIndex);
    if (fieldIndex < 0 || fieldIndex >= summary.fields.length) {
      return res.status(404).json({ error: 'Field index out of range' });
    }

    const field = summary.fields[fieldIndex];
    Object.assign(field, req.body);
    
    // Ensure order is maintained
    if (req.body.order !== undefined) {
      field.order = req.body.order;
    }
    
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
    const summary = await FrameSummary.findById(FRAME_SUMMARY_SINGLETON_ID);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }
    
    const fieldIndex = parseInt(req.params.fieldIndex);
    if (fieldIndex < 0 || fieldIndex >= summary.fields.length) {
      return res.status(404).json({ error: 'Field index out of range' });
    }
    
    summary.fields.splice(fieldIndex, 1);
    
    // Reorder remaining fields
    summary.fields.forEach((field, index) => {
      field.order = index + 1;
    });
    
    await summary.save();
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Reorder fields in the Frame Summary
 */
exports.reorderFields = async (req, res) => {
  try {
    const summary = await FrameSummary.findById(FRAME_SUMMARY_SINGLETON_ID);
    if (!summary) {
      return res.status(404).json({ error: 'FrameSummary not found' });
    }

    const { fieldOrders } = req.body; // Array of { fieldId, newOrder }
    
    if (!Array.isArray(fieldOrders)) {
      return res.status(400).json({ error: 'fieldOrders must be an array' });
    }

    // Update field orders
    fieldOrders.forEach(({ fieldIndex, newOrder }) => {
      if (fieldIndex >= 0 && fieldIndex < summary.fields.length) {
        summary.fields[fieldIndex].order = newOrder;
      }
    });

    // Sort fields by order
    summary.fields.sort((a, b) => a.order - b.order);
    
    await summary.save();
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
