const SightTest = require("../models/SightTestSchema"); // Adjust path as needed

// @desc    Create a new Sight Test Category (e.g., Private or NHS)
// @route   POST /api/sight-tests
const createSightTest = async (req, res) => {
    try {
        const { category, options, isActive } = req.body;

        const newSightTest = await SightTest.create({
            category,
            options,
            isActive
        });

        res.status(201).json(newSightTest);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all Sight Tests (For Admin/Seller - shows everything)
// @route   GET /api/sight-tests/admin
const getAllSightTests = async (req, res) => {
    try {
        const tests = await SightTest.find();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active Sight Tests only (For Customer App/Frontend)
// @route   GET /api/sight-tests
const getActiveSightTests = async (req, res) => {
    try {
        const tests = await SightTest.find({ isActive: true });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Sight Test Pricing and Options (The "Future-Proofing" Part)
// @route   PUT /api/sight-tests/:id
const updateSightTest = async (req, res) => {
    try {
        const { category, options, isActive } = req.body;

        const updatedTest = await SightTest.findByIdAndUpdate(
            req.params.id,
            { category, options, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedTest) {
            return res.status(404).json({ message: "Sight test not found" });
        }

        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ONLY prices (Useful for a quick price update UI)
// @route   PATCH /api/sight-tests/:id/prices
const updatePrices = async (req, res) => {
    try {
        const { options } = req.body; // Expects the full array of options with new prices

        const updatedTest = await SightTest.findByIdAndUpdate(
            req.params.id,
            { $set: { options: options } },
            { new: true }
        );

        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a Sight Test category
// @route   DELETE /api/sight-tests/:id
const deleteSightTest = async (req, res) => {
    try {
        const test = await SightTest.findByIdAndDelete(req.params.id);
        if (!test) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Sight test deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSightTest,
    getAllSightTests,
    getActiveSightTests,
    updateSightTest,
    updatePrices,
    deleteSightTest
};