const mongoose = require('mongoose');

const rowConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    label:   { type: String },
  },
  { _id: false }
);

const sectionConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    rows:    { type: Map, of: rowConfigSchema, default: {} },
  },
  { _id: false }
);

const reportConfigSchema = new mongoose.Schema(
  {
    configKey: {
      type:      String,
      default:   'global',
      unique:    true,
      immutable: true,
    },
    sections: {
      items: {
        type: sectionConfigSchema,
        default: () => ({
          enabled: true,
          rows: {
            frame:       { enabled: true, label: 'Frame' },
            ageGroup:    { enabled: true, label: 'Age Group' },
            lensType:    { enabled: true, label: 'Lens Type' },
            lensSubtype: { enabled: true, label: 'Lens Subtype' },
            lensIndex:   { enabled: true, label: 'Lens Index' },
            design:      { enabled: true, label: 'Design' },
            coatings:    { enabled: true, label: 'Coatings' },
            extras:      { enabled: true, label: 'Extras' },
            color:       { enabled: true, label: 'Color' },
            subtotal:    { enabled: true, label: 'Subtotal' },
          },
        }),
      },
      // Future sections go here, e.g.:
      // totals: { type: sectionConfigSchema, default: () => ({ enabled: true, rows: { ... } }) },
    },
  },
  { timestamps: true }
);

reportConfigSchema.statics.getGlobalConfig = async function () {
  let config = await this.findOne({ configKey: 'global' });
  if (!config) config = await this.create({});
  return config;
};

module.exports = mongoose.model('ReportConfig', reportConfigSchema);