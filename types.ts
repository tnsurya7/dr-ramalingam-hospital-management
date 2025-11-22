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
  adminNo: string;       // Auto-generated (ADM001, ADM002...)
  name: string;
  age: number;
  gender: string;        // Backend allows any string
  bloodGroup: string;
  contactNo: string;
  address: string;
  healthIssue: string;

  // Added to match backend timestamps from Mongoose
  createdAt?: string;
  updatedAt?: string;
}

// Page navigation enum (used by App.tsx)
export enum Page {
  Home,
  Login,
  PatientList,
  PatientDetail,
}