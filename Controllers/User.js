const { validationResult } = require("express-validator");
const User = require("../Models/User");
const { setUser } = require("../Services/Auth");
const bcrypt = require("bcrypt");
const { uploadOnCloudinary } = require("../Services/Cloudnary");




async function handleLogin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const { password: _, ...userWithoutPassword } = user._doc;
    const accessToken = setUser(userWithoutPassword);

    return res
      .status(200)
      .json({ user: userWithoutPassword, token: accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
}

async function handleSignUp(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(200).json({ msg: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...user } = newUser._doc;
    const payload = {
      email: newUser.email,
      _id: newUser._id,
    };

    const token = setUser(payload, process.env.ACCESS_TOKEN_SECRET_CODE);
    return res.json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
}

async function handlecheck(req, res) {
  res.end("Hello");
}

const handleUpdateUser = async (req, res) => {
  const email = req.user.id;
  const updates = req.body;
  if (req.file) {
    updates.profile_picture = await uploadOnCloudinary(req.file.path); 
  }
  
  try {
    const user = await User.findByIdAndUpdate(email, updates,{
      new: true
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Profile updated successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

async function handleGetUser(req, res) {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID).select("-password");
    if (!user) return res.status(400).json({ msg: "User Not Found" });

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
}


module.exports = {
  handleLogin,
  handleSignUp,
  handleUpdateUser,
  handlecheck,
  handleGetUser
};
