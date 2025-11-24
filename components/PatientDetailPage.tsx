/* --- PatientDetailPage.tsx (FULL UPDATED WORKING VERSION) --- */

import React, { useState } from "react";
import { ArrowLeft, Edit, Download, FileText, Save, X } from "lucide-react";
import { Patient } from "../types";
import jsPDF from "jspdf";

interface PatientDetailPageProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

const PatientDetailPage: React.FC<PatientDetailPageProps> = ({
  patient,
  onBack,
  onUpdatePatient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);

  const formatDateTime = (value?: string) =>
    value ? new Date(value).toLocaleString() : "N/A";

  const handleSave = () => {
    onUpdatePatient(editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  const downloadCSV = () => {
    const headers = ["Field", "Value"];
    const data = [
      ["Admin No", patient.adminNo],
      ["Name", patient.name],
      ["Age", String(patient.age)],
      ["Gender", patient.gender],
      ["Blood Group", patient.bloodGroup],
      ["Contact No", patient.contactNo],
      ["Address", patient.address],
      ["Height (cm)", patient.height !== undefined ? String(patient.height) : "N/A"],
      ["Weight (kg)", patient.weight !== undefined ? String(patient.weight) : "N/A"],
      ["Sugar Level (mg/dL)", patient.sugarLevel !== undefined ? String(patient.sugarLevel) : "N/A"],
      ["Blood Pressure", patient.bloodPressure ?? "N/A"],
      ["Health Issue", patient.healthIssue],
      ["Health Description", patient.healthDescription ?? "N/A"],
      ["Created On", formatDateTime(patient.createdAt)],
      ["Updated On", formatDateTime(patient.updatedAt)],
    ];

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient_${patient.adminNo}.csv`;
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("PATIENT DETAILS REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, {
      align: "center",
    });

    let yPosition = 45;

    const details: [string, string][] = [
      ["Admin No", patient.adminNo],
      ["Name", patient.name],
      ["Age", String(patient.age)],
      ["Gender", patient.gender],
      ["Blood Group", patient.bloodGroup],
      ["Contact No", patient.contactNo],
      ["Height", patient.height ? `${patient.height} cm` : "N/A"],
      ["Weight", patient.weight ? `${patient.weight} kg` : "N/A"],
      ["Sugar Level", patient.sugarLevel ? `${patient.sugarLevel} mg/dL` : "N/A"],
      ["Blood Pressure", patient.bloodPressure ?? "N/A"],
      ["Health Issue", patient.healthIssue],
      ["Created On", formatDateTime(patient.createdAt)],
      ["Updated On", formatDateTime(patient.updatedAt)],
    ];

    details.forEach(([label, value]) => {
      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, 20, yPosition);
      doc.setFont(undefined, "normal");
      doc.text(value, 70, yPosition);
      yPosition += 10;
    });

    doc.setFont(undefined, "bold");
    doc.text("Address:", 20, yPosition);
    yPosition += 7;

    doc.setFont(undefined, "normal");
    const addressLines = doc.splitTextToSize(patient.address || "N/A", 170);
    doc.text(addressLines, 20, yPosition);
    yPosition += addressLines.length * 7 + 10;

    if (patient.healthDescription) {
      doc.setFont(undefined, "bold");
      doc.text("Health Description:", 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, "normal");
      const descLines = doc.splitTextToSize(patient.healthDescription, 170);
      doc.text(descLines, 20, yPosition);
    }

    doc.save(`patient_${patient.adminNo}_report.pdf`);
  };

  const shouldShowDescription = () =>
    isEditing
      ? editedPatient.healthIssue === "other"
      : patient.healthIssue === "other" || !!patient.healthDescription;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-end mb-6 space-x-3">
        {!isEditing ? (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-blue">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </button>
            <button onClick={downloadCSV} className="btn-green">
              <Download className="h-4 w-4 mr-2" /> CSV
            </button>
            <button onClick={downloadPDF} className="btn-red">
              <FileText className="h-4 w-4 mr-2" /> PDF
            </button>
          </>
        ) : (
          <>
            <button onClick={handleSave} className="btn-green">
              <Save className="h-4 w-4 mr-2" /> Save
            </button>
            <button onClick={handleCancel} className="btn-gray">
              <X className="h-4 w-4 mr-2" /> Cancel
            </button>
          </>
        )}
      </div>

      {/* ✅ FULL DETAILS CARD */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin No */}
          <DetailField label="Admin No">
            {patient.adminNo}
          </DetailField>

          {/* Name */}
          <EditableField
            label="Name"
            isEditing={isEditing}
            value={editedPatient.name}
            onChange={(v) => setEditedPatient({ ...editedPatient, name: v })}
            display={patient.name}
          />

          {/* Age */}
          <EditableField
            label="Age"
            type="number"
            isEditing={isEditing}
            value={editedPatient.age}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, age: parseInt(v) || 0 })
            }
            display={patient.age}
          />

          {/* Gender */}
          <EditableSelect
            label="Gender"
            isEditing={isEditing}
            value={editedPatient.gender}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, gender: v as any })
            }
            options={["Male", "Female", "Other"]}
            display={patient.gender}
          />

          {/* Blood Group */}
          <EditableSelect
            label="Blood Group"
            isEditing={isEditing}
            value={editedPatient.bloodGroup}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, bloodGroup: v })
            }
            options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]}
            display={patient.bloodGroup}
          />

          {/* Contact No */}
          <EditableField
            label="Contact No"
            type="tel"
            isEditing={isEditing}
            value={editedPatient.contactNo}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, contactNo: v })
            }
            display={patient.contactNo}
          />

          {/* Height */}
          <EditableField
            label="Height (cm)"
            type="number"
            isEditing={isEditing}
            value={editedPatient.height ?? ""}
            onChange={(v) =>
              setEditedPatient({
                ...editedPatient,
                height: v === "" ? undefined : Number(v),
              })
            }
            display={patient.height ? `${patient.height} cm` : "N/A"}
          />

          {/* Weight */}
          <EditableField
            label="Weight (kg)"
            type="number"
            isEditing={isEditing}
            value={editedPatient.weight ?? ""}
            onChange={(v) =>
              setEditedPatient({
                ...editedPatient,
                weight: v === "" ? undefined : Number(v),
              })
            }
            display={patient.weight ? `${patient.weight} kg` : "N/A"}
          />

          {/* Sugar Level */}
          <EditableField
            label="Sugar Level (mg/dL)"
            type="number"
            isEditing={isEditing}
            value={editedPatient.sugarLevel ?? ""}
            onChange={(v) =>
              setEditedPatient({
                ...editedPatient,
                sugarLevel: v === "" ? undefined : Number(v),
              })
            }
            display={patient.sugarLevel ? `${patient.sugarLevel} mg/dL` : "N/A"}
          />

          {/* Blood Pressure */}
          <EditableField
            label="Blood Pressure"
            isEditing={isEditing}
            value={editedPatient.bloodPressure ?? ""}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, bloodPressure: v })
            }
            display={patient.bloodPressure ?? "N/A"}
          />

          {/* Created */}
          <DetailField label="Created On">
            {formatDateTime(patient.createdAt)}
          </DetailField>

          {/* Updated */}
          <DetailField label="Updated On">
            {formatDateTime(patient.updatedAt)}
          </DetailField>

          {/* Address */}
          <EditableTextarea
            label="Address"
            isEditing={isEditing}
            value={editedPatient.address}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, address: v })
            }
            display={patient.address}
          />

          {/* Health Issue */}
          <EditableSelect
            label="Health Issue"
            isEditing={isEditing}
            value={editedPatient.healthIssue}
            onChange={(v) =>
              setEditedPatient({ ...editedPatient, healthIssue: v as any })
            }
            options={["general", "diabetes", "other"]}
            display={patient.healthIssue}
          />

          {/* Description */}
          {shouldShowDescription() && (
            <EditableTextarea
              label="Description"
              isEditing={isEditing}
              value={editedPatient.healthDescription ?? ""}
              onChange={(v) =>
                setEditedPatient({ ...editedPatient, healthDescription: v })
              }
              display={patient.healthDescription ?? "N/A"}
            />
          )}
        </div>
      </div>

      <button onClick={onBack} className="btn-back">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back
      </button>
    </div>
  );
};

export default PatientDetailPage;