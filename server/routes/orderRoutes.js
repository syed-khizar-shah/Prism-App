const express = require('express');
const router = express.Router();
const {
  createOrder,
  addOrderPayment,
  getOrders,
  getOrderById,
  getOrderByOrderId,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  searchOrders,
  generateReceipt,
  getOrderByPrismId
} = require('../controllers/orderController');

// Create a new order
router.post('/', createOrder);
router.post('/:id/payments', addOrderPayment);

// Get all orders with pagination and filtering
router.get('/', getOrders);

// Get a single order by ID
router.get('/:id', getOrderById);

router.get('/by-prism-id/:prismId',getOrderByPrismId)

// Get order by orderId
router.get('/by-order-id/:orderId', getOrderByOrderId);

// Update an order
router.put('/:id', updateOrder);

// Delete an order
router.delete('/:id', deleteOrder);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// Generate and download receipt PDF for an order
router.get('/:id/receipt', generateReceipt);

// Search orders
router.get('/search', searchOrders);

module.exports = router;
