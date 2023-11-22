const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rentperday: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotels',
    required: true,
  },
}, {
  timestamps: true,
});

const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;
