require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Beneficiary = require("./models/Beneficiary");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("ImpactFlow Server is running");
});

app.get("/api/beneficiaries", async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.post("/api/beneficiaries", async (req, res) => {
  try {
    const beneficiary = new Beneficiary(req.body);

    const savedBeneficiary = await beneficiary.save();

    res.status(201).json(savedBeneficiary);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create beneficiary",
      error: error.message
    });
  }
});

app.put("/api/beneficiaries/:id", async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!beneficiary) {
      return res.status(404).json({
        message: "Beneficiary not found"
      });
    }

    res.json(beneficiary);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update beneficiary",
      error: error.message
    });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});