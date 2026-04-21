import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      photo: req.file ? req.file.filename : ""
    });

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
};


/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // send user without password
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        photo: user.photo
      }
    });

  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
};