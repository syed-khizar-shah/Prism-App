const Lens = require('../models/LensSchema');

exports.getAllLenses = async (req, res) => {
  try {
    const { ageGroup, ageGroupId, populate } = req.query;

    // Handle both ageGroup and ageGroupId parameters
    const filter = {};
    if (ageGroup) filter.ageGroups = ageGroup;
    if (ageGroupId) filter.ageGroups = ageGroupId;

    let query = Lens.find(filter);

    // Handle population based on query parameter
    if (populate) {
      const populateFields = populate.split(',').map(field => field.trim());
      populateFields.forEach(field => {
        query = query.populate(field);
      });
    } else {
      // Default population for backward compatibility
      query = query.populate('ageGroups')
                   .populate('powerLensMap.recommendedLenses')
                   .populate('subtypeOf');
    }

    
    const lenses = await query;
    console.log({lenses})
    res.json(lenses);
  } catch (err) {
    console.error('Error in getAllLenses:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getLensById = async (req, res) => {
  try {
    const { populate } = req.query;
    
    let query = Lens.findById(req.params.id);

    // Handle population
    if (populate) {
      const populateFields = populate.split(',').map(field => field.trim());
      populateFields.forEach(field => {
        query = query.populate(field);
      });
    }

    const lens = await query;
    if (!lens) return res.status(404).json({ error: 'Lens not found' });
    console.log({lens})
    
    res.json(lens);
  } catch (err) {
    console.error('Error in getLensById:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.createLens = async (req, res) => {
  try {
    const lens = new Lens(req.body);
    await lens.save();
    
    // Optionally populate the created lens before returning
    const { populate } = req.query;
    if (populate) {
      const populateFields = populate.split(',').map(field => field.trim());
      await lens.populate(populateFields);
    }
    
    res.status(201).json(lens);
  } catch (err) {
    console.error('Error in createLens:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateLens = async (req, res) => {
  try {
    const { populate } = req.query;
    console.log("update: ",populate)
    
    let lens = await Lens.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!lens) return res.status(404).json({ error: 'Lens not found' });

    // Handle population after update
    if (populate) {
      const populateFields = populate.split(',').map(field => field.trim());
      await lens.populate(populateFields);
    }
    
    res.json(lens);
  } catch (err) {
    console.error('Error in updateLens:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLens = async (req, res) => {
  try {
    const lens = await Lens.findByIdAndDelete(req.params.id);
    if (!lens) return res.status(404).json({ error: 'Lens not found' });
    res.json({ message: 'Lens deleted successfully' });
  } catch (err) {
    console.error('Error in deleteLens:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};