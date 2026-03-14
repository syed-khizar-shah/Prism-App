const express = require("express");
const router = express.Router();

// Import the controller functions
const {
    createSightTest,
    getAllSightTests,
    getActiveSightTests,
    updateSightTest,
    updatePrices,
    deleteSightTest
} = require("../controllers/sightTestController"); // Adjust path as needed

// --- CUSTOMER / SALES APP ROUTES ---

/**
 * @route   GET /api/sight-tests
 * @desc    Get only active sight tests for the customer selection screen
 */
router.get("/", getActiveSightTests);


// --- ADMIN / SELLER MANAGEMENT ROUTES ---

/**
 * @route   GET /api/sight-tests/admin
 * @desc    Get all sight tests (including inactive ones) for the seller dashboard
 */
router.get("/admin", getAllSightTests);

/**
 * @route   POST /api/sight-tests
 * @desc    Create a new sight test category (e.g., Private, NHS, Corporate)
 */
router.post("/", createSightTest);

/**
 * @route   PUT /api/sight-tests/:id
 * @desc    Update an entire category (Rename category, change isActive status, or rewrite options)
 */
router.put("/:id", updateSightTest);

/**
 * @route   PATCH /api/sight-tests/:id/prices
 * @desc    Quickly update prices within a category without changing other details
 */
router.patch("/:id/prices", updatePrices);

/**
 * @route   DELETE /api/sight-tests/:id
 * @desc    Remove a sight test category entirely
 */
router.delete("/:id", deleteSightTest);

module.exports = router;