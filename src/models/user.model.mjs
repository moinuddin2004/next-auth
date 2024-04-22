import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: [true, "plz provide email"], unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  forgotPasswordToken: { type: String },
  forgotPasswordExpiry:  Date ,
  verifyToken: { type: String },
  verifyTokenExpiry: Date
});

const User = mongoose.models.users || mongoose.model("users", Schema);
export default User;