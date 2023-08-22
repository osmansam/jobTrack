const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 1000,
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      maxlength: 100,
    },
    salary: {
      type: String,
      required: [true, "Please provide a salary"],
      maxlength: 100,
    },
    company: {
      type: String,
      required: [true, "Please provide a company"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    img: {
      type: String,
      default: "no-photo.jpg",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);
