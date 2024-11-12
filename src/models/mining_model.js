const mongoose = require('mongoose');

const miningSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  miningSession: {
    startTime: { type: Date },
    endTime: { type: Date },
  },
  minedCoins: { type: Number, default: 0 },
});

const Mining = mongoose.model('Mining', miningSchema);
module.exports = Mining;
