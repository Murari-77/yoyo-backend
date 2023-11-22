const mongoose = require('mongoose');

// Create a Mongoose schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['hotel', 'customer'], // Assuming only 'hotel' or 'customer' roles are allowed
    required: true,
  },
  hotelName: {
    type: String,
    required: function () {
      return this.role === 'hotel'; // Hotel-related fields required if the role is 'hotel'
    },
  },
  location: {
    type: String,
    required: function () {
      return this.role === 'hotel'; // Location required if the role is 'hotel'
    },
  },
  hotelStars: {
    type: Number,
    required: function () {
      return this.role === 'hotel'; // Hotel Stars required if the role is 'hotel'
    },
    enum: [1, 2, 3, 4, 5], // Assuming hotel stars are limited to a range of 1 to 5
  },
  fullName: {
    type: String,
    required: function () {
      return this.role === 'customer'; // Full Name required if the role is 'customer'
    },
  },
});

// Create a Mongoose model
const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
