import express, { Router } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import prisma from "../config/database";
import { protect } from "../middleware/auth";
import { sendLoginEmail, sendWelcomeEmail } from "../services/emailService"; // Updated imports
import { sendAdminNotification } from "../services/emailService"; // new

const router = Router();

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers, and underscores"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { username, email, password, firstName, lastName, role } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error:
            existingUser.email === email
              ? "Email already registered"
              : "Username already taken",
        });
      }

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password,
          firstName,
          lastName,
          role: role || "student",
        }
      });

      const token = generateToken(user.id.toString());

      // Send Welcome Email
      await sendWelcomeEmail(user.email, user.firstName);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        error: "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ 
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true
        }
      });
      if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

      if (!user.isActive)
        return res.status(401).json({ success: false, error: "Account is deactivated" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ success: false, error: "Invalid credentials" });

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id.toString());

      // ðŸ‘‡ Send Login Notification Email
      await sendLoginEmail(user.email);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: "Server error during login" });
    }
  }
);

export default router;
