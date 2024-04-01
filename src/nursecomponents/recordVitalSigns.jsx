import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useAuth } from "../authcontext.jsx";
import { useNavigate } from "react-router-dom";

const RECORD_VITAL_SIGNS_MUTATION = gql`
  mutation RecordVitalSigns(
    $nurseUsername: String!
    $patientId: ID!
    $bodyTemperature: Float
    $heartRate: Float
    $bloodPressure: String
    $respiratoryRate: Float
  ) {
    recordVitalSigns(
      nurseUsername: $nurseUsername
      patientId: $patientId
      bodyTemperature: $bodyTemperature
      heartRate: $heartRate
      bloodPressure: $bloodPressure
      respiratoryRate: $respiratoryRate
    ) {
      id
    }
  }
`;

const GET_PATIENTS_QUERY = gql`
  query GetPatients {
    patients {
      id
      username
    }
  }
`;

function RecordVitalSigns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nurseUsername = user ? user.username : null;
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [bodyTemperature, setBodyTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");

  const [recordVitalSignsMutation, { loading, error }] = useMutation(
    RECORD_VITAL_SIGNS_MUTATION,
    {
      onCompleted(data) {
        if (data.recordVitalSigns) {
          alert("Vital signs recorded successfully.");
        }
      },
      onError(error) {
        alert(`Error recording vital signs: ${error.message}`);
      },
    }
  );

  const { data: patientsData, loading: patientsLoading } =
    useQuery(GET_PATIENTS_QUERY);

  const handleSubmit = (e) => {
    e.preventDefault();
    recordVitalSignsMutation({
      variables: {
        nurseUsername,
        patientId: selectedPatientId,
        bodyTemperature: parseFloat(bodyTemperature) || null,
        heartRate: parseFloat(heartRate) || null,
        bloodPressure: bloodPressure || null,
        respiratoryRate: parseFloat(respiratoryRate) || null,
      },
      onCompleted: () => {
        navigate("/viewvitalsigns");
      },
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Record Vital Signs</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="patientId" className="form-label">
            Select Patient
          </label>
          <select
            id="patientId"
            className="form-select"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            disabled={patientsLoading}
          >
            <option value="">Select a Patient</option>
            {patientsData &&
              patientsData.patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.username}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Body Temperature"
            value={bodyTemperature}
            onChange={(e) => setBodyTemperature(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Heart Rate"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Blood Pressure"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Respiratory Rate"
            value={respiratoryRate}
            onChange={(e) => setRespiratoryRate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RecordVitalSigns;
