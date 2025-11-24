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

  const formatDateTime = (value?: string) => {
    return value ? new Date(value).toLocaleString() : 'N/A';
  };

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
      ['Height (cm)', patient.height !== undefined ? String(patient.height) : ''],
      ['Weight (kg)', patient.weight !== undefined ? String(patient.weight) : ''],
      ['Sugar Level (mg/dL)', patient.sugarLevel !== undefined ? String(patient.sugarLevel) : ''],
      ['Blood Pressure', patient.bloodPressure ?? ''],
      ['Health Issue', patient.healthIssue],
      ['Health Description', patient.healthDescription ?? ''],
      ['Created On', formatDateTime(patient.createdAt)],
      ['Updated On', formatDateTime(patient.updatedAt)]
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
    
    doc.setFontSize(18);
    doc.text('PATIENT DETAILS REPORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
    
    let yPosition = 45;

    const details: [string, string][] = [
      ['Admin No', patient.adminNo],
      ['Name', patient.name],
      ['Age', patient.age.toString()],
      ['Gender', patient.gender],
      ['Blood Group', patient.bloodGroup],
      ['Contact No', patient.contactNo],
      ['Height', patient.height !== undefined ? `${patient.height} cm` : ''],
      ['Weight', patient.weight !== undefined ? `${patient.weight} kg` : ''],
      ['Sugar Level', patient.sugarLevel !== undefined ? `${patient.sugarLevel} mg/dL` : ''],
      ['Blood Pressure', patient.bloodPressure ?? ''],
      ['Health Issue', patient.healthIssue],
      ['Created On', formatDateTime(patient.createdAt)],
      ['Updated On', formatDateTime(patient.updatedAt)]
    ];

    details.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value || 'N/A', 70, yPosition);
      yPosition += 10;
    });

    // Address section
    doc.setFont(undefined, 'bold');
    doc.text('Address:', 20, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'normal');
    const addressLines = doc.splitTextToSize(patient.address || 'N/A', 170);
    doc.text(addressLines, 20, yPosition);
    yPosition += (addressLines.length * 7) + 10;

    // Health Description (for "other")
    if (patient.healthDescription) {
      doc.setFont(undefined, 'bold');
      doc.text('Health Description:', 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(patient.healthDescription, 170);
      doc.text(descLines, 20, yPosition);
    }

    doc.save(`patient_${patient.adminNo}_report.pdf`);
  };

  // Helper to know when to show description block
  const shouldShowDescription = () => {
    if (isEditing) {
      return editedPatient.healthIssue === 'other';
    }
    return patient.healthIssue === 'other' || !!patient.healthDescription;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Action Buttons */}
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

      {/* Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin No</label>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
              {patient.adminNo}
            </div>
          </div>

          {/* Name */}
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

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.age}
                min={1}
                max={120}
                onChange={(e) => setEditedPatient({...editedPatient, age: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.age}
              </div>
            )}
          </div>

          {/* Gender */}
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
              <span className="px-3 py-2 inline-block bg-blue-100 text-blue-700 border border-blue-300 rounded-lg">
                {patient.gender}
              </span>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            {isEditing ? (
              <select
                value={editedPatient.bloodGroup}
                onChange={(e) => setEditedPatient({...editedPatient, bloodGroup: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            ) : (
              <span className="px-3 py-2 inline-block bg-red-100 text-red-700 border border-red-300 rounded-lg">
                {patient.bloodGroup}
              </span>
            )}
          </div>

          {/* Contact No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact No</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedPatient.contactNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    setEditedPatient({ ...editedPatient, contactNo: value });
                  }
                }}
                maxLength={10}
                pattern="\d{10}"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.contactNo}
              </div>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.height ?? ''}
                onChange={(e) =>
                  setEditedPatient({
                    ...editedPatient,
                    height: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.height !== undefined ? `${patient.height} cm` : 'N/A'}
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.weight ?? ''}
                onChange={(e) =>
                  setEditedPatient({
                    ...editedPatient,
                    weight: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.weight !== undefined ? `${patient.weight} kg` : 'N/A'}
              </div>
            )}
          </div>

          {/* Sugar Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Level (mg/dL)</label>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.sugarLevel ?? ''}
                onChange={(e) =>
                  setEditedPatient({
                    ...editedPatient,
                    sugarLevel: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.sugarLevel !== undefined ? `${patient.sugarLevel} mg/dL` : 'N/A'}
              </div>
            )}
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
            {isEditing ? (
              <input
                type="text"
                placeholder="e.g. 120/80"
                value={editedPatient.bloodPressure ?? ''}
                onChange={(e) => setEditedPatient({ ...editedPatient, bloodPressure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.bloodPressure ?? 'N/A'}
              </div>
            )}
          </div>

          {/* Created On */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Created On</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              {formatDateTime(patient.createdAt)}
            </div>
          </div>

          {/* Updated On */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Updated On</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              {formatDateTime(patient.updatedAt)}
            </div>
          </div>

          {/* Address */}
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

          {/* Health Issue (Dropdown) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Health Issue</label>
            {isEditing ? (
              <select
                value={editedPatient.healthIssue}
                onChange={(e) =>
                  setEditedPatient({
                    ...editedPatient,
                    healthIssue: e.target.value as 'general' | 'diabetes' | 'other',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="diabetes">Diabetes</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {patient.healthIssue}
              </div>
            )}
          </div>

          {/* Description (Only when Health Issue is "other") */}
          {shouldShowDescription() && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              {isEditing ? (
                <textarea
                  value={editedPatient.healthDescription ?? ''}
                  onChange={(e) =>
                    setEditedPatient({
                      ...editedPatient,
                      healthDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg min-h-[80px]">
                  {patient.healthDescription ?? 'N/A'}
                </div>
              )}
            </div>
          )}
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