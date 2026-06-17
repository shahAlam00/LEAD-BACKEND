// मॉडल को इम्पोर्ट करें (.js एक्सटेंशन ज़रूरी है)
import User from '../models/auth.model.js'; 

// ─── ADMIN: POST /admin/admins (Create Admin) ───────────────────────────────────
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const user = await User.create({ name, email, password, role: "admin" });

    res.status(201).json({ 
      success: true, 
      message: "Admin created successfully", 
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: GET /admin/admins (Get All) ──────────────────────────────────────────
export const getAdmins = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const query = { role: "admin" };
    
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      User.find(query).select("name email isActive createdAt").sort("-createdAt").skip(skip).limit(parsedLimit).lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({ 
      success: true, 
      data, 
      total, 
      totalPages: Math.ceil(total / parsedLimit) || 1, 
      currentPage: parsedPage 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: PATCH /admin/admins/:id (Update) ──────────────────────────────────────
export const updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { name, email, password } = req.body;

    const user = await User.findOne({ _id: adminId, role: "admin" });
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (name) user.name = name;
    
    if (email) {
      const exists = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: adminId } });
      if (exists) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      }
      user.password = password;
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Admin updated successfully", 
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: DELETE /admin/admins/:id (Delete) ────────────────────────────────────
export const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const user = await User.findOneAndDelete({ _id: adminId, role: "admin" });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: PATCH /admin/admins/:id/suspend (Toggle Status) ─────────────────────
export const suspendAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const user = await User.findOne({ _id: adminId, role: "admin" });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    const msg = user.isActive ? "Admin activated successfully" : "Admin suspended successfully";

    res.status(200).json({ 
      success: true, 
      message: msg, 
      data: { _id: user._id, isActive: user.isActive } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};