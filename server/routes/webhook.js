const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User"); // Import User model
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { sendEmail } = require("../utils/email"); // Import your sendEmail function

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
        const data = event.data.object;
        const orderId = data.metadata.orderId;
        const paid = data.payment_status === "paid";

        if (orderId && paid) {
          // Fetch order and user from the database
          let order = await Order.findById(orderId).populate("userId").exec();
          if (!order) {
            console.error("Order not found");
            return res.status(404).send("Order not found");
          }

          order.status = "paid";

          order = await order.save();

          const user = order.userId; // User details populated from order

          // Prepare invoice data
          const invoiceData = prepareInvoice(order);

          // Prepare email content
          let emailContent = generateCustomerInvoiceEmailContent(
            invoiceData,
            user.fullName
          );

          // Send email to customer
          await sendEmail(
            user.email,
            "Your Order Invoice - 2020Optix",
            emailContent
          );

          emailContent = generateStoreInvoiceEmailContent(
            invoiceData,
            user
          );

          // Send email to store
          await sendEmail(
            "2020optix.stockport@gmail.com",
            "New Paid Order - 2020Optix",
            emailContent
          );

          console.log("Order status updated to 'paid' and emails sent.");
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send("ok");
  }
);

// Function to prepare the invoice data
const prepareInvoice = (order) => {
  return {
    customerName: order.userId.fullName, // Use user's full name
    orderId: order.ID,
    products: order.products,
    total: order.total,
    status: order.status,
    date: order.createdAt,
    cardBrand: order.cardBrand,
    cardNumber: order.cardNumber,
    discountPercentage: order.discountPercentage,
  };
};

// Function to generate invoice email content
const generateCustomerInvoiceEmailContent = (invoiceData, customerName) => {
  const productList = invoiceData.products
    .map(
      (product) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${product.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">£${product.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${product.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">£${(product.price * product.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `
    <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background-color: #dfbc58; padding: 30px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 700;">2020Optix</h1>
        <p style="margin: 10px 0 0; font-size: 20px; font-weight: 300;">Order Confirmation</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">Dear ${customerName},</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Thank you for your order! We are pleased to confirm your purchase. Here are the details of your order:</p>
        
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dfbc58;">Product</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dfbc58;">Unit Price</th>
              <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dfbc58;">Quantity</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dfbc58;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productList}
          </tbody>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Order ID:</td>
            <td style="padding: 12px;">${invoiceData.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Status:</td>
            <td style="padding: 12px;">${invoiceData.status}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 12px;">£${invoiceData.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Date:</td>
            <td style="padding: 12px;">${new Date(invoiceData.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Discount:</td>
            <td style="padding: 12px;">${invoiceData.discountPercentage}%</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-radius: 8px;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">2020Optix - Opticians</p>
        <p style="margin: 10px 0; font-size: 14px; color: #666;">68 Prince's Street, Stockport, SK11RJ, UK</p>
        <p style="margin: 0; font-size: 14px;">
          <a href="mailto:contactus@2020optix.co.uk" style="color: #dfbc58; text-decoration: none;">contactus@2020optix.co.uk</a> | 
          <a href="tel:01613838620" style="color: #dfbc58; text-decoration: none;">0161 383 8620</a>
        </p>
      </div>
    </div>
  `;
};

const generateStoreInvoiceEmailContent = (invoiceData, user) => {
  const productList = invoiceData.products
    .map(
      (product) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${product.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">£${product.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${product.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">£${(product.price * product.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background-color: #dfbc58; padding: 30px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 300;">2020Optix</h1>
        <p style="margin: 10px 0 0; font-size: 20px; font-weight: 300;">New Paid Order</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello Team,</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">A new order has been marked as paid. Here are the details:</p>

        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 15px; background-color: #f8f8f8; font-weight: bold; width: 30%;">Customer:</td>
            <td style="padding: 15px;">${user.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 15px; background-color: #f8f8f8; font-weight: bold;">Phone:</td>
            <td style="padding: 15px;">${user.phone}</td>
          </tr>
        </table>
        
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dfbc58;">Product</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dfbc58;">Unit Price</th>
              <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dfbc58;">Quantity</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dfbc58;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productList}
          </tbody>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Order ID:</td>
            <td style="padding: 12px;">${invoiceData.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Status:</td>
            <td style="padding: 12px;">${invoiceData.status}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 12px;">£${invoiceData.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Date:</td>
            <td style="padding: 12px;">${new Date(invoiceData.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 12px; text-align: right; font-weight: bold;">Discount:</td>
            <td style="padding: 12px;">${invoiceData.discountPercentage}%</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-radius: 8px;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">2020Optix - Opticians</p>
        <p style="margin: 10px 0; font-size: 14px; color: #666;">68 Prince's Street, Stockport, SK11RJ, UK</p>
        <p style="margin: 0; font-size: 14px;">
          <a href="mailto:contactus@2020optix.co.uk" style="color: #dfbc58; text-decoration: none;">contactus@2020optix.co.uk</a> | 
          <a href="tel:01613838620" style="color: #dfbc58; text-decoration: none;">0161 383 8620</a>
        </p>
      </div>
    </div>
  `;
};

module.exports = router;
