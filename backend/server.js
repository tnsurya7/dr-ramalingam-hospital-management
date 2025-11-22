const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (temporary storage)
let patients = [];
let patientCounter = 0;

console.log('✅ Using in-memory database (no MongoDB required)');

// Routes

// Get all patients
app.get('/api/patients', (req, res) => {
  try {
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Get a single patient
app.get('/api/patients/:adminNo', (req, res) => {
  try {
    const patient = patients.find(p => p.adminNo === req.params.adminNo);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

// Add a new patient
app.post('/api/patients', (req, res) => {
  try {
    patientCounter++;
    const adminNo = `ADM${String(patientCounter).padStart(3, '0')}`;

    const patient = {
      ...req.body,
      adminNo,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    patients.push(patient);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient', error: error.message });
  }
});

// Update a patient
app.put('/api/patients/:adminNo', (req, res) => {
  try {
    const index = patients.findIndex(p => p.adminNo === req.params.adminNo);

    if (index === -1) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patients[index] = {
      ...patients[index],
      ...req.body,
      updatedAt: new Date()
    };

    res.json(patients[index]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete a patient
app.delete('/api/patients/:adminNo', (req, res) => {
  try {
    const index = patients.findIndex(p => p.adminNo === req.params.adminNo);

    if (index === -1) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patients.splice(index, 1);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Hospital Management Backend is running!', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});