import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js"; // Yahan import karein

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Ab ye function yahan use karein
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};