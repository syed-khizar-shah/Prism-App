const ReportConfig = require('../models/reportConfig');

const SECTION_ROW_MAP = {
  items: [
    'frame', 'ageGroup', 'lensType', 'lensSubtype', 'lensIndex',
    'design', 'coatings', 'extras', 'color', 'subtotal',
  ],
  // totals: ['subtotal', 'discount', 'total'],
};

const ALLOWED_SECTIONS = Object.keys(SECTION_ROW_MAP);

// GET /api/report-config
exports.getConfig = async (req, res) => {
  try {
    const config = await ReportConfig.getGlobalConfig();
    // Convert Map fields to plain objects before sending
    const data = config.toObject({ virtuals: false });
    for (const sectionKey of ALLOWED_SECTIONS) {
      if (data.sections[sectionKey]?.rows instanceof Map) {
        data.sections[sectionKey].rows = Object.fromEntries(data.sections[sectionKey].rows);
      }
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/report-config/sections/:section
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;

    if (!ALLOWED_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Unknown section: "${section}". Allowed: ${ALLOWED_SECTIONS.join(', ')}`,
      });
    }

    const config = await ReportConfig.getGlobalConfig();
    if (req.body.enabled !== undefined) {
      config.sections[section].enabled = req.body.enabled;
    }
    await config.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/report-config/sections/:section/rows
// Body: { frame: { enabled: false, label: 'Frame' }, ... }
exports.updateRows = async (req, res) => {
  try {
    const { section } = req.params;

    if (!ALLOWED_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Unknown section: "${section}". Allowed: ${ALLOWED_SECTIONS.join(', ')}`,
      });
    }

    const updates     = req.body;
    const allowedRows = SECTION_ROW_MAP[section];
    const invalid     = Object.keys(updates).filter(k => !allowedRows.includes(k));

    if (invalid.length) {
      return res.status(400).json({
        success: false,
        message: `Unknown row(s): ${invalid.join(', ')}. Allowed: ${allowedRows.join(', ')}`,
      });
    }

    const config = await ReportConfig.getGlobalConfig();

    for (const [rowKey, values] of Object.entries(updates)) {
      const existing = config.sections[section].rows.get(rowKey) || {};
      config.sections[section].rows.set(rowKey, {
        enabled: values.enabled ?? existing.enabled ?? true,
        label:   values.label   ?? existing.label   ?? rowKey,
      });
    }

    // Mark the nested Map as modified so Mongoose picks up the change
    config.markModified(`sections.${section}.rows`);
    await config.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/report-config/reset
exports.resetConfig = async (req, res) => {
  try {
    await ReportConfig.deleteOne({ configKey: 'global' });
    const fresh = await ReportConfig.getGlobalConfig();
    const data  = fresh.toObject({ virtuals: false });
    for (const sectionKey of ALLOWED_SECTIONS) {
      if (data.sections[sectionKey]?.rows instanceof Map) {
        data.sections[sectionKey].rows = Object.fromEntries(data.sections[sectionKey].rows);
      }
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};