const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Beneficiary = require("./models/Beneficiary");

const app = express();

app.use(express.json());

// GET all beneficiaries
app.get("/api/beneficiaries", async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });