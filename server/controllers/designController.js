const Design = require('../models/DesignSchema');

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find()
      .populate('lensType recommendedLens coatings')
      .populate({
        path: 'extras.extra',
        model: 'Extras'
      })
      .populate({
        path: 'extras.colors',
        model: 'Color'
      });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('lensType recommendedLens coatings')
      .populate({
        path: 'extras.extra',
        model: 'Extras'
      })
      .populate({
        path: 'extras.colors',
        model: 'Color'
      });
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Find designs by lensType and recommendedLens
exports.getDesignByLensPair = async (req, res) => {
  try {
    const { lensTypeId, recommendedLensId } = req.body;
    if (!lensTypeId || !recommendedLensId) {
      return res.status(400).json({ error: 'Missing lensTypeId or recommendedLensId' });
    }

    let designs = await Design.find({
      lensType: lensTypeId,
      recommendedLens: recommendedLensId
    })
      .populate('lensType')
      .populate('recommendedLens')
      .populate('coatings')
      .populate({
        path: 'extras.extra',
        model: 'Extras'
      })
      .populate({
        path: 'extras.colors',
        model: 'Color'
      });

    if (designs.length === 0) {
      designs = await Design.find({
        lensType: lensTypeId,
      })
        .populate('lensType')
        .populate('recommendedLens')
        .populate('coatings')
        .populate({
          path: 'extras.extra',
          model: 'Extras'
        })
        .populate({
          path: 'extras.colors',
          model: 'Color'
        });
    }

    res.json(designs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.createDesign = async (req, res) => {
  try {
    // Clean up the request body before saving
    const designData = { ...req.body };

    // Handle empty recommendedLens - convert empty string to null/undefined
    if (designData.recommendedLens === '' || designData.recommendedLens === null) {
      delete designData.recommendedLens;
    }

    // Handle empty lensType (safety check)
    if (designData.lensType === '' || designData.lensType === null) {
      delete designData.lensType;
    }

    // Handle empty arrays for coating
    if (Array.isArray(designData.coatings) && designData.coatings.length === 0) {
      designData.coatings = [];
    }

    // Handle extras array - ensure proper structure
    if (Array.isArray(designData.extras)) {
      designData.extras = designData.extras.map(extraItem => {
        // If it's already in the correct format, keep it
        if (extraItem.extra || extraItem.colors) {
          return {
            extra: extraItem.extra,
            colors: Array.isArray(extraItem.colors) ? extraItem.colors : []
          };
        }
        // If it's just an ObjectId (old format), convert it
        return {
          extra: extraItem,
          colors: []
        };
      }).filter(item => item.extra); // Remove any items without an extra reference
    } else {
      designData.extras = [];
    }

    const design = new Design(designData);
    await design.save();
    
    // Populate the created design before returning
    const populatedDesign = await Design.findById(design._id)
      .populate('lensType recommendedLens coatings')
      .populate({
        path: 'extras.extra',
        model: 'Extras'
      })
      .populate({
        path: 'extras.colors',
        model: 'Color'
      });
      
    res.status(201).json(populatedDesign);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateDesign = async (req, res) => {
  try {
    const { id } = req.params;

    // Clean up the request body before updating
    const updateData = { ...req.body };

    // Handle empty recommendedLens
    if (updateData.recommendedLens === '' || updateData.recommendedLens === null) {
      delete updateData.recommendedLens;
    }

    // Handle empty lensType
    if (updateData.lensType === '' || updateData.lensType === null) {
      delete updateData.lensType;
    }

    // Handle extras array - ensure proper structure
    if (Array.isArray(updateData.extras)) {
      updateData.extras = updateData.extras.map(extraItem => {
        // If it's already in the correct format, keep it
        if (extraItem.extra || extraItem.colors) {
          return {
            extra: extraItem.extra,
            colors: Array.isArray(extraItem.colors) ? extraItem.colors : []
          };
        }
        // If it's just an ObjectId (old format), convert it
        return {
          extra: extraItem,
          colors: []
        };
      }).filter(item => item.extra); // Remove any items without an extra reference
    }

    const design = await Design.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('lensType recommendedLens coatings')
      .populate({
        path: 'extras.extra',
        model: 'Extras'
      })
      .populate({
        path: 'extras.colors',
        model: 'Color'
      });

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.json(design);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json({ message: 'Design deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};