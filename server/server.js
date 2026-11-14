require("dotenv").config();

const express = require("express");
const passport = require("./config/passport");
const googleAuth = require("./routes/googleAuth");
const upload = require("./routes/upload");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Beneficiary = require("./models/Beneficiary");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const { validateRegistrationInput } = require("./utils/registration");
const {
  ProgramDescriptionError,
  generateProgramDescription
} = require("./services/programDescription");

const app = express();

app.use(passport.initialize());

app.use(cors());
app.use(express.json());
app.use("/auth", googleAuth);
app.use("/api/upload", upload);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token"
      });
    }

    req.user = user;
    next();
  });
};

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

app.post("/api/ai/program-description", authenticateToken, async (req, res) => {
  try {
    const description = await generateProgramDescription(req.body);
    res.json({ description });
  } catch (error) {
    if (error instanceof ProgramDescriptionError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("Program description generation failed:", error.message);
    return res.status(500).json({
      message: "Unable to generate a program description. Please try again."
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const registration = validateRegistrationInput(req.body);
    if (registration.error) {
      return res.status(400).json({ message: registration.error });
    }
    const { normalizedEmail, accountName, accountUsername } = registration;
    const { password } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { username: accountUsername },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : [])
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists. Please sign in instead."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: accountUsername,
      password: hashedPassword,
      ...(accountName ? { name: accountName } : {}),
      ...(normalizedEmail ? { email: normalizedEmail } : {})
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        name: user.name || user.username,
        email: user.email || ""
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists. Please sign in instead."
      });
    }

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

app.get(
  "/api/beneficiaries",
  authenticateToken,
  async (req, res) => {
    try {
      const beneficiaries = await Beneficiary.find();
      res.json(beneficiaries);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (email || username)?.trim();

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    if (!user.password) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name || user.username,
        email: user.email || ""
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

app.put(
  "/api/beneficiaries/:id",
  authenticateToken,
  async (req, res) => {
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
  }
);

app.delete(
  "/api/beneficiaries/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const beneficiary = await Beneficiary.findByIdAndDelete(
        req.params.id
      );

      if (!beneficiary) {
        return res.status(404).json({
          message: "Beneficiary not found"
        });
      }

      res.json({
        message: "Beneficiary deleted successfully"
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to delete beneficiary",
        error: error.message
      });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});