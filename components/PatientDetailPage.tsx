import React, { useState } from 'react';
import { ArrowLeft, Edit, Download, FileText, Save, X } from 'lucide-react';
import { Patient } from '../types';
import jsPDF from 'jspdf';

interface PatientDetailPageProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

const PatientDetailPage: React.FC<PatientDetailPageProps> = ({ 
  patient, 
  onBack, 
  onUpdatePatient 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);

  const handleSave = () => {
    onUpdatePatient(editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  const downloadCSV = () => {
    const headers = ['Field', 'Value'];
    const data = [
      ['Admin No', patient.adminNo],
      ['Name', patient.name],
      ['Age', patient.age.toString()],
      ['Gender', patient.gender],
      ['Blood Group', patient.bloodGroup],
      ['Contact No', patient.contactNo],
      ['Address', patient.address],
      ['Health Issue', patient.healthIssue]
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient_${patient.adminNo}.csv`;
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('PATIENT DETAILS REPORT', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
    
    let yPosition = 45;
    
    // Patient Details
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Admin No:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(patient.adminNo, 70, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Name:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(patient.name, 70, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Age:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(patient.age.toString(), 70, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Gender:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(patient.gender, 70, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Blood Group:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(patient.bloodGroup, 70, yPosition);
    yPosition += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Contact No:', 20, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(patient.contactNo, 70, yPosition);
    yPosition += 15;
    
    doc.setFont(undefined, 'bold');
    doc.text('Address:', 20, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'normal');
    const addressLines = doc.splitTextToSize(patient.address, 170);
    doc.text(addressLines, 20, yPosition);
    yPosition += (addressLines.length * 7) + 8;
    
    doc.setFont(undefined, 'bold');
    doc.text('Health Issue:', 20, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'normal');
    const healthLines = doc.splitTextToSize(patient.healthIssue, 170);
    doc.text(healthLines, 20, yPosition);
    yPosition += (healthLines.length * 7) + 8;
    
    
    doc.save(`patient_${patient.adminNo}_report.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={downloadCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
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
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Patient Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin No</label>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
              {patient.adminNo}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedPatient.name}
                onChange={(e) => setEditedPatient({...editedPatient, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.age}
                onChange={(e) => setEditedPatient({...editedPatient, age: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.age}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {isEditing ? (
              <select
                value={editedPatient.gender}
                onChange={(e) => setEditedPatient({...editedPatient, gender: e.target.value as 'Male' | 'Female' | 'Other'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.gender}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            {isEditing ? (
              <input
                type="text"
                value={editedPatient.bloodGroup}
                onChange={(e) => setEditedPatient({...editedPatient, bloodGroup: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.bloodGroup}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact No</label>
            {isEditing ? (
              <input
                type="text"
                value={editedPatient.contactNo}
                onChange={(e) => setEditedPatient({...editedPatient, contactNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.contactNo}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <textarea
                value={editedPatient.address}
                onChange={(e) => setEditedPatient({...editedPatient, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg min-h-[80px]">
                {patient.address}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Health Issue</label>
            {isEditing ? (
              <textarea
                value={editedPatient.healthIssue}
                onChange={(e) => setEditedPatient({...editedPatient, healthIssue: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg min-h-[80px]">
                {patient.healthIssue}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed bottom-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>
    </div>
  );
};

export default PatientDetailPage;