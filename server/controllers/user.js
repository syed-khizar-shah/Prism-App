const User = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }


        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("Login failed: no user found for email:", email);
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        // Verify password
        const isMatch = await existingUser.comparePassword(password);
        if (!isMatch) {
            console.log("Login failed: password mismatch for email:", email);
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        // Generate JWT token with role
        const token = jwt.sign(
            {
                id: existingUser._id,
                role: existingUser.role || 'user' // Default to 'user' if role not set
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log("Login successful for email:", email);

        res.json({
            success: "Login Successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role || 'user'
            }
        });
    } catch (error) {
        console.error("Login error for email:", req.body?.email, "-", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Credentials missing"
            });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                error: "User already exists"
            });
        }

        const user = new User({
            name,
            email,
            password,
            role: "user",
        })
        await user.save();

        // Generate JWT token with role
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role || 'user' // Default to 'user' if role not set
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: "Registration Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

const getUsers = async (req, res) => {
    try {


        const existingUser = await User.find({});
        res.status(201).json({
            success: "Registration Successful",
            users: existingUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

module.exports = {
    loginUser,
    registerUser,
    getUsers,
};
