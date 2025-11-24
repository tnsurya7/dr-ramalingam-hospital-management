// Doctor information type (used for header/profile section)
export interface Doctor {
  name: string;
  qualification: string;
  specialization: string;
  experience: number;
  contact: string;
  image: string;
}

// Patient type fully synced with MongoDB backend schema
export interface Patient {
  adminNo: string;

  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';

  bloodGroup: 
    'A+' | 'A-' | 
    'B+' | 'B-' | 
    'O+' | 'O-' | 
    'AB+' | 'AB-';

  contactNo: string;
  address: string;

  height?: number;        // cm
  weight?: number;        // kg
  sugarLevel?: number;    // mg/dL
  bloodPressure?: string; // "120/80"

  healthIssue: 'general' | 'diabetes' | 'other';
  healthDescription?: string;

  createdAt: string;
  updatedAt: string;
}

// Page navigation enum (used by App.tsx)
export enum Page {
  Home,
  Login,
  PatientList,
  PatientDetail,
}