import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: [true, "Fullname is required."] },
    email: { type: String, unique: true, required: [true, "Email is required."] },
    username: { type: String, unique: true, required: [true, "Username is required."] },
    password: { type: String, required: [true, "Password is required."] },
  },
  { timestamps: true }
);

//compile schema into a model, first argument should be the singular form of db collection name
module.exports = mongoose.model("User", userSchema);
