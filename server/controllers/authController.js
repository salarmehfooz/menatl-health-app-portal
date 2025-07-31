import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createBulkNotifications } from "./notificationController.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const register = async (req, res) => {
  const { username, email, password, role, gender, emergencyContact } =
    req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      passwordHash: hash,
      role,
      gender,
      emergencyContact,
    });

    // Notify all admins about the new user registration
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      recipientId: admin._id,
      type: "user_registered",
      message: `New user registered: ${username}`,
      meta: { userId: user._id },
    }));

    await createBulkNotifications(notifications);

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        gender: user.gender,
      },
    });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        gender: user.gender,
      },
    });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Missing token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied: insufficient permissions" });
    }
    next();
  };
};

export { register, login, protect, requireRole };
