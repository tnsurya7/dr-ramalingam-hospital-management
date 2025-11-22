import React, { useState } from 'react';
import { Search, Plus, Download, FileText, ArrowLeft, Trash2 } from 'lucide-react';
import { Patient } from '../types';
import jsPDF from 'jspdf';

interface PatientListPageProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: (patient: Omit<Patient, 'adminNo'>) => void;
  onDeletePatient?: (adminNo: string) => void;
  onBack?: () => void;
}

const PatientListPage: React.FC<PatientListPageProps> = ({ 
  patients, 
  onSelectPatient, 
  onAddPatient,
  onDeletePatient,
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'adminNo'>>({
    name: '',
    age: 0,
    gender: 'Male',
    bloodGroup: '',
    contactNo: '',
    address: '',
    healthIssue: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.adminNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient(newPatient);
    setNewPatient({
      name: '',
      age: 0,
      gender: 'Male',
      bloodGroup: '',
      contactNo: '',
      address: '',
      healthIssue: ''
    });
    setShowAddForm(false);
  };

  const downloadCSV = () => {
    const headers = ['Admin No', 'Name', 'Age', 'Gender', 'Blood Group', 'Contact No'];
    const csvContent = [
      headers.join(','),
      ...patients.map(p => [p.adminNo, p.name, p.age, p.gender, p.bloodGroup, p.contactNo].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('PATIENT LIST REPORT', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
    
    let yPosition = 35;
    
    patients.forEach((patient, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${patient.name} (${patient.adminNo})`, 15, yPosition);
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      
      doc.text(`Age: ${patient.age}  |  Gender: ${patient.gender}  |  Blood Group: ${patient.bloodGroup}`, 20, yPosition);
      yPosition += 6;
      
      doc.text(`Contact: ${patient.contactNo}`, 20, yPosition);
      yPosition += 6;
      
      doc.text(`Address: ${patient.address}`, 20, yPosition);
      yPosition += 6;
      
      doc.text(`Health Issue: ${patient.healthIssue}`, 20, yPosition);
      yPosition += 10;
    });
    
    doc.setFontSize(10);
    doc.text(`Total Patients: ${patients.length}`, 15, yPosition);
    
    doc.save('patients_report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </button>
          <button
            onClick={downloadCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </button>
          <button
            onClick={downloadPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.adminNo}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td 
                    onClick={() => onSelectPatient(patient)}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {patient.adminNo}
                  </td>
                  <td 
                    onClick={() => onSelectPatient(patient)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  >
                    {patient.name}
                  </td>
                  <td 
                    onClick={() => onSelectPatient(patient)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  >
                    {patient.gender}
                  </td>
                  <td 
                    onClick={() => onSelectPatient(patient)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  >
                    {patient.age}
                  </td>
                  <td 
                    onClick={() => onSelectPatient(patient)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  >
                    {patient.bloodGroup}
                  </td>
                  <td 
                    onClick={() => onSelectPatient(patient)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                  >
                    {patient.contactNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPatientToDelete(patient);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Patient"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as 'Male' | 'Female' | 'Other'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={newPatient.bloodGroup}
                  onChange={(e) => setNewPatient({...newPatient, bloodGroup: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., A+, B-, O+"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                <input
                  type="text"
                  value={newPatient.contactNo}
                  onChange={(e) => setNewPatient({...newPatient, contactNo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Health Issue</label>
                <textarea
                  value={newPatient.healthIssue}
                  onChange={(e) => setNewPatient({...newPatient, healthIssue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Delete</h2>
            <p className="text-center mb-6">
              Are you sure you want to delete <strong>{patientToDelete.name}</strong>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (onDeletePatient) {
                    onDeletePatient(patientToDelete.adminNo);
                  }
                  setShowDeleteModal(false);
                  setPatientToDelete(null);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPatientToDelete(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {onBack && (
        <button
          onClick={onBack}
          className="fixed bottom-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      )}
    </div>
  );
};

export default PatientListPage;