const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
    const { email, password, role, hotelName, location, hotelStars, fullName } = req.body;
  
    try {
      // Check if the user already exists with the provided email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
  
      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
  
      // Create a new user instance with hashed password
      const newUser = new User({
        email,
        password: hashedPassword,
        role,
        hotelName: role === 'hotel' ? hotelName : undefined,
        location: role === 'hotel' ? location : undefined,
        hotelStars: role === 'hotel' ? hotelStars : undefined,
        fullName: role === 'customer' ? fullName : undefined,
      });
  
      // Save the user to the database
      await newUser.save();
  
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists and validate password
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          return res.status(200).json(user);
        } else {
          return res.status(400).json({ message: "Invalid email or password" });
        }
      } else {
        return res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

router.get("/getAllHotels", async (req, res) => {
    try {
        const hotels = await User.find({ role: 'hotel' }).select('-password');
        res.send(hotels);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
