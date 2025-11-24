import { Patient } from '../types';

// ✅ Uses environment variable with fallback (Vercel + Render + Local)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE ||
  "https://hospital-management-lmz4.onrender.com";

// ✅ Safely parse JSON (prevents "<!DOCTYPE" crash)
const safeJSON = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Invalid JSON response from server:", text);
    throw new Error("Server returned invalid JSON");
  }
};

export const patientAPI = {
  // ✅ Get all patients
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    return safeJSON(response);
  },

  // ✅ Get single patient
  getPatient: async (adminNo: string): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patient');
    }
    return safeJSON(response);
  },

  // ✅ Add new patient
  addPatient: async (patient: Omit<Patient, 'adminNo'>): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error('Failed to add patient');
    }
    return safeJSON(response);
  },

  // ✅ Update patient
  updatePatient: async (adminNo: string, patient: Patient): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        "Accept": "application/json"
      },
      body: JSON.stringify(patient),
    });
    if (!response.ok) {
      throw new Error('Failed to update patient');
    }
    return safeJSON(response);
  },

  // ✅ Delete patient
  deletePatient: async (adminNo: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      method: 'DELETE',
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      throw new Error('Failed to delete patient');
    }
  },

  // ✅ Backend health check
  healthCheck: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      throw new Error('Backend not available');
    }
    return safeJSON(response);
  }
};