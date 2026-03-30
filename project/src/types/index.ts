export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  bloodGroup: string;
  condition: string;
  riskLevel: 'critical' | 'high' | 'moderate' | 'stable';
  lastVisit: string;
  nextAppointment?: string;
}

export interface Vital {
  id: string;
  patientId: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
  sugarLevel: number;
  timestamp: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate?: string;
  adherence: 'excellent' | 'good' | 'poor';
  status: 'active' | 'completed' | 'discontinued';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  reason: string;
  doctor: string;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  type: 'diagnosis' | 'surgery' | 'emergency' | 'checkup';
  title: string;
  description: string;
  date: string;
  doctor: string;
}

export interface Report {
  id: string;
  patientId: string;
  name: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
  aiSummary?: string;
  status: 'pending' | 'processed' | 'failed';
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AISummary {
  id: string;
  patientId: string;
  overallSummary: string;
  specificSummaries: {
    vitals: string;
    medications: string;
    conditions: string;
  };
  lastUpdated: string;
  version: number;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingReports: number;
  criticalCases: number;
}
