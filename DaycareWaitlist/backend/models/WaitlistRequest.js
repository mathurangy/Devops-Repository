const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  childName: { type: String, required: true },
  childAge: { type: Number, required: true },
  startDate: { type: String, required: true },
  location: { type: String, required: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
}, { timestamps: true });

module.exports = mongoose.model("WaitlistRequest", waitlistSchema);