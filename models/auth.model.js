import mongoose from "mongoose";
import bcrypt from "bcrypt"; // पासवर्ड हैश करने के लिए

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "Admin User" // पुराने यूज़र्स के लिए डिफ़ॉल्ट नेम ताकि क्रैश न हो
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6
    // ध्यान दें: अगर आपके पुराने लॉगिन कोड में 'select: false' की वजह से पासवर्ड नहीं मिल रहा हो, 
    // तो आप यहाँ से 'select: false' हटा सकते हैं या लॉगिन क्वेरी में .select("+password") लगा सकते हैं।
  },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'superadmin'], // आपके सारे रोल्स यहाँ आ गए
    default: "admin" 
  },
  isActive: {
    type: Boolean,
    default: true // एडमिन को सस्पेंड/एक्टिवेट करने के लिए ज़रूरी है
  }
}, {
  timestamps: true // इससे createdAt और updatedAt अपने आप डेटाबेस में सेवे होंगे
});

// ─── PASSWORD HASHING HOOK ────────────────────────────────────────
// नया एडमिन बनते समय या पासवर्ड बदलते समय यह अपने आप उसे हैश कर देगा
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── COMPARE PASSWORD METHOD ──────────────────────────────────────
// इसे आप अपने लॉगिन कंट्रोलर में इस्तेमाल कर सकते हैं (जैसे: user.comparePassword(password))
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── OVERWRITE ERROR SAFE EXPORT ──────────────────────────────────
// यह चेक करेगा कि मॉडल पहले से बना है या नहीं, जिससे Nodemon क्रैश नहीं होगा
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;