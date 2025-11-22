import { Patient } from '../types';

// Backend now runs on port 5001
const API_BASE_URL = 'http://localhost:5001/api';

export const patientAPI = {
  // Get all patients
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    return response.json();
  },

  // Get single patient
  getPatient: async (adminNo: string): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`);
    if (!response.ok) {
      throw new Error('Failed to fetch patient');
    }
    return response.json();
  },

  // Add new patient
  addPatient: async (patient: Omit<Patient, 'adminNo'>): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error('Failed to add patient');
    }
    return response.json();
  },

  // Update patient
  updatePatient: async (adminNo: string, patient: Patient): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error('Failed to update patient');
    }
    return response.json();
  },

  // Delete patient
  deletePatient: async (adminNo: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete patient');
    }
  },

  // Health check (still required)
  healthCheck: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Backend not available');
    }
    return response.json();
  }
};