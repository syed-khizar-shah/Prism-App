const Order = require('../models/OrderSchema');
const ReportConfig = require('../models/reportConfig');

const { generateReceiptBuffer, generateOrderDetailPdfBuffer } = require('../utils/pdf/pdf');
const pdfService = require('../services/pdfService');
const { getConfig } = require('./reportConfigController');
const { MONEY_EPSILON, round2 } = require('../utils/money');

// Helper: round to 2 decimal places safely

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      selections,
      sightTest,
      promo,
      nhsgos3 = 0,
      checkoutDiscountType,   // 'percentage' | 'fixed'
      checkoutDiscountValue,  // raw number entered by staff
      payment,
      notes,
      salesperson,
      storeLocation,
      status
    } = req.body;
    console.log({
      customer,
      selections,
      sightTest,
      promo,
      nhsgos3,
      checkoutDiscountType,   // 'percentage' | 'fixed'
      checkoutDiscountValue,  // raw number entered by staff
      payment,
      notes,
      salesperson,
      storeLocation,
      status
    })

    console.log("Creating Order with data:", {
      customerName: customer?.name,
      selectionCount: selections?.length,
      sightTest,
      totalPayment: payment?.amount
    });

    // --- 1. Validation ---
    if (!customer || !customer.name) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }

    if (!selections || selections.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one selection is required' });
    }

    if (!payment || !payment.method || typeof payment.amount !== 'number' || payment.amount <= 0) {
      return res.status(400).json({ success: false, error: 'Payment method and a positive amount are required' });
    }
    payment.amount = round2(payment.amount);

    const validPaymentTypes = ['deposit', 'balance', 'partial', 'full'];
    if (payment.type && !validPaymentTypes.includes(payment.type)) {
      return res.status(400).json({ success: false, error: 'Invalid payment type' });
    }

    if (checkoutDiscountType && !['percentage', 'fixed'].includes(checkoutDiscountType)) {
      return res.status(400).json({ success: false, error: 'Invalid checkout discount type' });
    }

    if (checkoutDiscountValue != null && (typeof checkoutDiscountValue !== 'number' || isNaN(checkoutDiscountValue))) {
      return res.status(400).json({ success: false, error: 'Checkout discount value must be a valid number' });
    }
    if (nhsgos3 != null && (typeof nhsgos3 !== 'number' || isNaN(nhsgos3) || nhsgos3 < 0)) {
      return res.status(400).json({ success: false, error: 'NHS GOS3 must be a non-negative number' });
    }
    if (checkoutDiscountType === 'percentage' && checkoutDiscountValue > 100) {
      return res.status(400).json({ success: false, error: 'Percentage discount cannot exceed 100' });
    }

    // --- 2. Calculation Logic ---

    // Calculate sum of frames/lenses
    const selectionsTotal = round2(selections.reduce((total, selection) => {
      return total + (selection.selectionPrice || 0);
    }, 0));

    // Get sight test fee (default to 0 if not applicable)
    const sightTestFee = (sightTest && sightTest.hadTest) ? (sightTest.price || 0) : 0;

    // Subtotal = Frames/Lenses + Sight Test Fee
    const subtotal = selectionsTotal + sightTestFee;

    // Calculate promo + NHS discounts first
    const promoDiscount = promo ? (promo.appliedDiscount || 0) : 0;

    if (nhsgos3 != null && (typeof nhsgos3 !== 'number' || isNaN(nhsgos3) || nhsgos3 < 0)) {
      return res.status(400).json({ success: false, error: 'NHS GOS3 must be a non-negative number' });
    }

    // Amount remaining after promo/NHS, before checkout discount
    const preCheckoutDiscountAmount = round2(Math.max(subtotal - promoDiscount - nhsgos3, 0));

    // Resolve checkout discount amount from type + value
    let checkoutDiscountAmount = 0;
    if (checkoutDiscountType && checkoutDiscountValue) {
      if (checkoutDiscountType === 'percentage') {
        checkoutDiscountAmount = (preCheckoutDiscountAmount * checkoutDiscountValue) / 100;
      } else {
        checkoutDiscountAmount = checkoutDiscountValue;
      }
      checkoutDiscountAmount = round2(Math.min(checkoutDiscountAmount, preCheckoutDiscountAmount));
    }

    const totalDiscount = round2(promoDiscount + nhsgos3 + checkoutDiscountAmount);

    // Final Total
    const totalPrice = round2(Math.max(subtotal - totalDiscount, 0));

    if (payment.amount > totalPrice + MONEY_EPSILON) {
      return res.status(400).json({
        success: false,
        error: `Payment of ${payment.amount} exceeds order total of ${totalPrice}`
      });
    }
    const inferredType = payment.type || (payment.amount >= totalPrice ? 'full' : 'deposit');


    // --- 3. Create Order Document ---
    const order = new Order({
      customer,
      selections,
      sightTest: {
        hadTest: sightTest?.hadTest || false,
        category: sightTest?.category || null,
        tier: sightTest?.tier || null,
        price: sightTestFee
      },
      promo,
      payment: {
        transactions: [{
          type: inferredType, // default: assume full payment if type not specified
          method: payment.method,
          amount: payment.amount,
          transactionId: payment.transactionId,
          paymentDate: payment.paymentDate || new Date(),
          takenBy: payment.takenBy || salesperson,
          notes: payment.notes
        }]
        // amountPaid / balanceDue / paymentStatus filled in by the pre-save hook
      },
      pricing: {
        subtotal,
        sightTestFee,
        discount: totalDiscount,
        discounts: {
          promo: promoDiscount,
          nhsgos3: nhsgos3,
          checkout: checkoutDiscountAmount
        },
        checkoutDiscountType: checkoutDiscountType || undefined,
        checkoutDiscountValue: checkoutDiscountValue || undefined,
        totalPrice,
        tax: 0,
        shipping: 0
      },
      notes,
      salesperson,
      storeLocation,
      status
    });

    // Save the order
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);

    let errorMessage = 'Failed to create order';
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.code === 11000) {
      errorMessage = 'Duplicate order ID';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message
    });
  }
};

const addOrderPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, method, amount, transactionId, notes, takenBy } = req.body;

    if (!method || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Payment method and a positive amount are required' });
    }

    const validPaymentTypes = ['deposit', 'balance', 'partial', 'full', 'refund'];
    if (type && !validPaymentTypes.includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid payment type' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await order.addPayment({ type: type || 'balance', method, amount, transactionId, notes, takenBy });

    res.json({
      success: true,
      order,
      paymentStatus: order.payment.paymentStatus,
      amountPaid: order.payment.amountPaid,
      balanceDue: order.payment.balanceDue
    });

  } catch (error) {
    if (error.code === 'PAYMENT_EXCEEDS_TOTAL' || error.code === 'REFUND_EXCEEDS_PAID' || error.code === 'INVALID_AMOUNT') {
      return res.status(400).json({ success: false, error: error.message, remaining: error.remaining });
    }
    console.error('Error adding payment:', error);
    res.status(500).json({ success: false, error: 'Failed to add payment', details: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          'customer.name': {
            $regex: search,
            $options: 'i',
          },
        },
        {
          orderId: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limitNumber),

      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      orders,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      details: error.message,
    });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      details: error.message
    });
  }
};

// Get order by orderId
const getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      details: error.message
    });
  }
};

const getOrderByPrismId = async (req, res) => {
  try {
    const { prismId } = req.params;

    const order = await Order.findOne({
      "customer.prismId": prismId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
      details: error.message,
    });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.payment;

    // // Remove fields that shouldn't be updated directly
    // delete updateData._id;
    // delete updateData.orderId;
    // delete updateData.createdAt;

    const order = await Order.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      details: error.message
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order',
      details: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    console.log("called status change")
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order,
      message: `Order status updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      details: error.message
    });
  }
};

// Search orders by customer name or order ID
const searchOrders = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const orders = await Order.find({
      $or: [
        { 'customer.name': { $regex: query, $options: 'i' } },
        { orderId: { $regex: query, $options: 'i' } }
      ]
    })
      .sort({ orderDate: -1 })
      .limit(20);

    res.json({
      success: true,
      orders,
      total: orders.length
    });

  } catch (error) {
    console.error('Error searching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search orders',
      details: error.message
    });
  }
};

// Generate and download PDF receipt for an order (on-demand, no storage)
const generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const [order, config] = await Promise.all([
      Order.findById(id),
      ReportConfig.getGlobalConfig(),
    ]);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const pdfBuffer = await generateReceiptBuffer(order, config.sections);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${order.orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ success: false, error: 'Failed to generate receipt', details: error.message });
  }
};

const generateOrderDetailPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const [order, config] = await Promise.all([
      Order.findById(id),
      ReportConfig.getGlobalConfig(),
    ]);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const pdfBuffer = await generateOrderDetailPdfBuffer(order, config.sections);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="order-${order.orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating order detail pdf:', error);
    res.status(500).json({ success: false, error: 'Failed to generate order detail pdf', details: error.message });
  }
};



module.exports = {
  createOrder,
  addOrderPayment,
  getOrders,
  getOrderById,
  getOrderByOrderId,
  getOrderByPrismId,
  deleteOrder,
  updateOrder,
  updateOrderStatus,
  searchOrders,
  generateReceipt,
  generateOrderDetailPdf
};
