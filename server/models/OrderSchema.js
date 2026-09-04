const mongoose = require('mongoose');
const { MONEY_EPSILON, round2 } = require('../utils/money');

// Schema for Sight Test
const orderSightTestSchema = new mongoose.Schema({
  hadTest: {
    type: Boolean,
    required: true,
    default: false
  },
  category: String, // e.g., "Private" or "NHS"
  tier: String,     // e.g., "Enhanced" or "Ultimate"
  price: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });


// Schema for customer information
const customerInfoSchema = new mongoose.Schema({
  prismId: {
    type: String,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  landline:{
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
    address: String,
  }
}, { _id: false });

// Schema for payment information
// const paymentInfoSchema = new mongoose.Schema({
//   method: {
//     type: String,
//     required: true,
//     enum: ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Other']
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   transactionId: String,
//   paymentDate: Date,
//   notes: String
// }, { _id: false });

// Schema for a single payment transaction (deposit, balance, partial, etc.)
const paymentTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'balance', 'partial', 'refund', 'full'],
    default: 'partial'
  },
  method: {
    type: String,
    required: true,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionId: String,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  takenBy: String,
  notes: String
}, { _id: true }); // individual payments get their own _id so they can be referenced/voided

// Schema for overall payment state on the order
const paymentInfoSchema = new mongoose.Schema({
  transactions: {
    type: [paymentTransactionSchema],
    required: true,
    validate: {
      validator: arr => arr && arr.length > 0,
      message: 'Order must have at least one payment transaction'
    }
  },

  // Denormalized summary fields — kept in sync via pre-save hook
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceDue: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'deposit_paid', 'partially_paid', 'paid', 'refunded'],
    default: 'unpaid',
    index: true
  },

  balanceDueDate: Date // e.g. expected on delivery/collection
}, { _id: false });

// Schema for order selection
const orderSelectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: String,

  // Lens configuration (stored as names and prices, not references)
  ageGroup: {
    name: String,
    price: Number
  },

  lensType: {
    name: String,
    price: Number
  },

  lensSubtype: {
    name: String,
    price: Number
  },

  powerMap: {
    min: Number,
    max: Number
  },

  recommendedLens: {
    name: String,
    price: Number
  },

  design: {
    name: String,
    price: Number,
    isVisible: Boolean
  },

  coatings: {
    name: String,
    price: Number
  },

  extras: {
    name: String,
    price: Number
  },

  color: {
    name: String,
    code: String
  },

  // Frame data (dynamic fields)
  frameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  rePd: Number,
  lePd: Number,
  reH: Number,
  leH: Number,
  selectionNotes: {
    type: String,
    trim: true
  },

  // Calculated price for this selection
  selectionPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

// Schema for order promo
const orderPromoSchema = new mongoose.Schema({
  code: String,
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed']
  },
  discountValue: Number,
  appliedDiscount: {
    type: Number,
    required: false,
    min: 0,
    default: 0
  }
}, { _id: false });

// Schema for order pricing
const orderPricingSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  sightTestFee: { // Explicitly stored for easy reporting
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  discounts: {
    promo: {
      type: Number,
      min: 0
    },
    nhsgos3: {
      type: Number,
      min: 0
    },
    checkout: {                    // <-- resolved monetary amount
      type: Number,
      min: 0,
      default: 0
    }
  },
  checkoutDiscountType: {          // <-- what the staff toggled
    type: String,
    enum: ['percentage', 'fixed'],
  },
  checkoutDiscountValue: {         // <-- raw value entered (e.g. 10 for 10% or 10 for £10)
    type: Number,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    min: 0,
    default: 0
  },
  shipping: {
    type: Number,
    min: 0,
    default: 0
  }
}, { _id: false });

// Main Order Schema
const orderSchema = new mongoose.Schema({
  // Order identification
  orderId: {
    type: String,
    required: false, // Changed from true to false
    unique: true,
    index: true
  },

  // Customer information
  customer: {
    type: customerInfoSchema,
    required: true
  },

  sightTest: {
    type: orderSightTestSchema,
    required: true,
    default: () => ({ hadTest: false, price: 0 })
  },

  // Order details
  selections: {
    type: [orderSelectionSchema],
    required: true,
    validate: {
      validator: function (selections) {
        return selections && selections.length > 0;
      },
      message: 'Order must have at least one selection'
    }
  },

  promo: {
    type: orderPromoSchema,
    default: null,
    required: false
  },

  // Pricing
  pricing: {
    type: orderPricingSchema,
    required: true
  },

  // Payment information
  payment: {
    type: paymentInfoSchema,
    required: true
  },

  // Order metadata
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },

  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },

  // Optional fields
  notes: {
    type: String,
  },
  salesperson: {
    type: String,
  },
  storeLocation: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'orders'
});

// Indexes for better query performance
orderSchema.index({ 'customer.name': 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ 'pricing.totalPrice': -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.balanceDue': -1 });

orderSchema.pre('save', function (next) {
  const transactions = this.payment?.transactions || [];

  const paid = round2(
    transactions
      .filter(t => t.type !== 'refund')
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const refunded = round2(
    transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netPaid = round2(paid - refunded);
  const total = round2(this.pricing?.totalPrice || 0);

  this.payment.amountPaid = netPaid;
  this.payment.balanceDue = round2(Math.max(total - netPaid, 0));

  if (netPaid <= 0) {
    this.payment.paymentStatus = 'unpaid';
  } else if (netPaid >= total - MONEY_EPSILON) {
    this.payment.paymentStatus = 'paid';
  } else if (transactions.some(t => t.type === 'deposit')) {
    this.payment.paymentStatus = 'deposit_paid';
  } else {
    this.payment.paymentStatus = 'partially_paid';
  }

  next();
});

// Pre-save middleware to generate orderId if not provided
orderSchema.pre('save', async function (next) {
  // Always generate orderId if it doesn't exist
  if (!this.orderId || this.orderId.trim() === '') {
    try {
      // Get current date in DDMMYY format
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const datePrefix = `${day}${month}${year}`;

      // Find the highest order number for today
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const todayOrders = await this.constructor.find({
        orderDate: { $gte: todayStart, $lt: todayEnd }
      }).sort({ orderId: -1 }).limit(1);

      let orderNumber = 1;
      if (todayOrders.length > 0 && todayOrders[0].orderId) {
        // Extract the order number from existing order ID
        const existingOrderId = todayOrders[0].orderId;
        if (existingOrderId.length >= 8) {
          const existingNumber = parseInt(existingOrderId.slice(-3));
          if (!isNaN(existingNumber)) {
            orderNumber = existingNumber + 1;
          }
        }
      }

      // Format: DDMMYY + 3-digit order number (e.g., 24825001)
      this.orderId = `${datePrefix}${String(orderNumber).padStart(3, '0')}`;
    } catch (error) {
      // Fallback to timestamp-based ID if there's an error
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(2, 4);
      this.orderId = `${timestamp}${randomString}`;
    }
  }
  next();
});

// Static method to generate order ID for a specific date
orderSchema.statics.generateOrderId = async function (date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const datePrefix = `${day}${month}${year}`;

  // Find the highest order number for the specified date
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const orders = await this.find({
    orderDate: { $gte: dateStart, $lt: dateEnd }
  }).sort({ orderId: -1 }).limit(1);

  let orderNumber = 1;
  if (orders.length > 0 && orders[0].orderId) {
    const existingOrderId = orders[0].orderId;
    if (existingOrderId.length >= 8) {
      const existingNumber = parseInt(existingOrderId.slice(-3));
      if (!isNaN(existingNumber)) {
        orderNumber = existingNumber + 1;
      }
    }
  }

  return `${datePrefix}${String(orderNumber).padStart(3, '0')}`;
};

// Static method to validate order ID format
orderSchema.statics.isValidOrderId = function (orderId) {
  if (!orderId || typeof orderId !== 'string') return false;

  // Check if it matches DDMMYY + 3 digits format
  const regex = /^\d{8}$/;
  if (!regex.test(orderId)) return false;

  // Extract date parts
  const day = parseInt(orderId.slice(0, 2));
  const month = parseInt(orderId.slice(2, 4));
  const year = parseInt(orderId.slice(4, 6));

  // Basic date validation
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 0 || year > 99) {
    return false;
  }

  return true;
};

// Static method to extract date from order ID
orderSchema.statics.getDateFromOrderId = function (orderId) {
  if (!this.isValidOrderId(orderId)) return null;

  const day = parseInt(orderId.slice(0, 2));
  const month = parseInt(orderId.slice(2, 4));
  const year = parseInt(orderId.slice(4, 6));

  // Assume years 00-99 are 2000-2099
  const fullYear = year < 50 ? 2000 + year : 1900 + year;

  return new Date(fullYear, month - 1, day);
};

orderSchema.methods.addPayment = function (transaction) {
  const total = round2(this.pricing?.totalPrice || 0);

  const currentlyPaid = round2(
    this.payment.transactions
      .filter(t => t.type !== 'refund')
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const currentlyRefunded = round2(
    this.payment.transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const netPaidSoFar = round2(currentlyPaid - currentlyRefunded);

  // Round the incoming transaction amount too, so stray float input can't sneak in
  transaction.amount = round2(transaction.amount);

  if (transaction.type !== 'refund') {
    const projectedTotal = round2(netPaidSoFar + transaction.amount);

    if (projectedTotal > total + MONEY_EPSILON) {
      const remaining = round2(Math.max(total - netPaidSoFar, 0));
      const err = new Error(
        `Payment of ${transaction.amount} would exceed the order total. ` +
        `Remaining balance is ${remaining.toFixed(2)}.`
      );
      err.code = 'PAYMENT_EXCEEDS_TOTAL';
      err.remaining = remaining;
      throw err;
    }
  } else {
    if (transaction.amount > netPaidSoFar + MONEY_EPSILON) {
      const err = new Error(
        `Refund of ${transaction.amount} exceeds amount paid (${netPaidSoFar.toFixed(2)}).`
      );
      err.code = 'REFUND_EXCEEDS_PAID';
      throw err;
    }
  }

  this.payment.transactions.push(transaction);
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
