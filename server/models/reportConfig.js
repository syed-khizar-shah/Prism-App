const mongoose = require('mongoose');

const rowConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    label: { type: String },
  },
  { _id: false }
);

const sectionConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    rows: { type: Map, of: rowConfigSchema, default: {} },
  },
  { _id: false }
);

const reportConfigSchema = new mongoose.Schema(
  {
    configKey: {
      type: String,
      default: 'global',
      unique: true,
      immutable: true,
    },
    sections: {
      items: {
        type: sectionConfigSchema,
        default: () => ({
          enabled: true,
          rows: {
            frame: { enabled: true, label: 'Frame' },
            ageGroup: { enabled: true, label: 'Age Group' },
            lensType: { enabled: true, label: 'Lens Type' },
            lensSubtype: { enabled: true, label: 'Lens Subtype' },
            lensIndex: { enabled: true, label: 'Lens Index' },
            design: { enabled: true, label: 'Design' },
            coatings: { enabled: true, label: 'Coatings' },
            extras: { enabled: true, label: 'Extras' },
            color: { enabled: true, label: 'Color' },
            subtotal: { enabled: true, label: 'Subtotal' },
          },
        }),
      },

      totals: {
        type: sectionConfigSchema,
        default: () => ({
          enabled: true,
          rows: {
            subtotal: { enabled: true, label: 'Subtotal' },
            promo: { enabled: true, label: 'Promotion' },
            nhsgos3: { enabled: true, label: 'NHS Voucher' },
            checkoutDiscount: { enabled: true, label: 'Discount' },
            total: { enabled: true, label: 'Total' },
            // Payment / deposit breakdown
            paymentStatus: { enabled: true, label: 'Status' },
            transactions: { enabled: true, label: 'Payment History' },
            amountPaid: { enabled: true, label: 'Amount Paid' },
            balanceDue: { enabled: true, label: 'Balance Due' },
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
  if (!config) {
    config = await this.create({});
    return config;
  }

  // Backfill any sections that didn't exist yet when this doc was first created
  // (Mongoose only applies schema defaults on document creation, not retroactively).
  let changed = false;
  const sectionPaths = Object.keys(this.schema.paths).filter(p => p.startsWith('sections.') && p.split('.').length === 2);

  for (const path of sectionPaths) {
    const sectionKey = path.split('.')[1];
    if (!config.sections[sectionKey]) {
      const defaultFn = this.schema.path(path).defaultValue;
      config.sections[sectionKey] = typeof defaultFn === 'function' ? defaultFn() : defaultFn;
      changed = true;
    }
  }

  if (changed) {
    config.markModified('sections');
    await config.save();
  }

  return config;
};

module.exports = mongoose.model('ReportConfig', reportConfigSchema);