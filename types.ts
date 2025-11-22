
export interface Doctor {
  name: string;
  qualification: string;
  specialization: string;
  experience: number;
  contact: string;
  image: string;
}

export interface Patient {
  adminNo: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  contactNo: string;
  address: string;
  healthIssue: string;
  medicineList?: string;
}

export enum Page {
  Home,
  Login,
  PatientList,
  PatientDetail,
}
