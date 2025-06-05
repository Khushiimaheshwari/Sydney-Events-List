const mongoose = require("mongoose");

const emailSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EmailSubscriber", emailSubscriberSchema);
