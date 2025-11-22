const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// ✅ Create Express app
const app = express();

// ✅ Use Render assigned port OR fallback
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Remove Mongoose strictQuery warning
mongoose.set('strictQuery', true);

// ✅ MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:YOUR_PASSWORD@hospital-db.4l9mmm2.mongodb.net/hospital?retryWrites=true&w=majority&appName=hospital-db";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected via Mongoose"))
  .catch((err) => {
    console.error("❌ Mongoose connection error:", err.message);
    console.log("⚠️ Check: password, IP whitelist, cluster running state");
  });

// ✅ Patient Model
const Patient = mongoose.model(
  "Patient",
  new mongoose.Schema(
    {
      adminNo: String,
      name: String,
      age: Number,
      gender: String,
      bloodGroup: String,
      contactNo: String,
      address: String,
      healthIssue: String
    },
    { timestamps: true }
  )
);

// ✅ API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Hospital Management Backend is running!",
    timestamp: new Date(),
  });
});

// Get all patients
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ adminNo: 1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
});

// Get single patient
app.get("/api/patients/:adminNo", async (req, res) => {
  try {
    const patient = await Patient.findOne({ adminNo: req.params.adminNo });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
});

// Add new patient
app.post("/api/patients", async (req, res) => {
  try {
    const lastPatient = await Patient.findOne().sort({ adminNo: -1 });
    const lastNumber = lastPatient ? parseInt(lastPatient.adminNo.replace("ADM", "")) : 0;
    const adminNo = `ADM${String(lastNumber + 1).padStart(3, "0")}`;

    const patient = new Patient({
      ...req.body,
      adminNo
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: "Error creating patient", error: error.message });
  }
});

// Update patient
app.put("/api/patients/:adminNo", async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { adminNo: req.params.adminNo },
      { ...req.body },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: "Error updating patient", error: error.message });
  }
});

// Delete patient
app.delete("/api/patients/:adminNo", async (req, res) => {
  try {
    const deleted = await Patient.findOneAndDelete({ adminNo: req.params.adminNo });

    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error: error.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});