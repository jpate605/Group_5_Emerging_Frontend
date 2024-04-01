import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_VITAL_SIGNS_BY_PATIENT_USERNAME_QUERY = gql`
  query GetVitalSignsByPatientUsername($patientUsername: String!) {
    getVitalSignsByPatientUsername(patientUsername: $patientUsername) {
      id
      nurseId
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      createdAt
    }
  }
`;

// Add a query to get the list of patients if you don't have it already
const GET_PATIENTS_QUERY = gql`
  query GetPatients {
    patients {
      id
      username
    }
  }
`;

function ViewVitalSignsHistory() {
  const [patientUsername, setPatientUsername] = useState("");
  const { data, loading, error } = useQuery(
    GET_VITAL_SIGNS_BY_PATIENT_USERNAME_QUERY,
    {
      variables: { patientUsername },
      skip: !patientUsername,
    }
  );
  if (data) {
    console.log(
      "Number of records:",
      data.getVitalSignsByPatientUsername.length
    );
  }

  const { data: patientsData } = useQuery(GET_PATIENTS_QUERY);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">View Vital Signs History</h2>
      <div className="row">
        <div className="col-md-6">
          <select
            className="form-select"
            value={patientUsername}
            onChange={(e) => setPatientUsername(e.target.value)}
          >
            <option value="">Select a Patient</option>
            {patientsData &&
              patientsData.patients.map((patient) => (
                <option key={patient.id} value={patient.username}>
                  {patient.username}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="mt-3">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Body Temperature</th>
                <th>Heart Rate</th>
                <th>Blood Pressure</th>
                <th>Respiratory Rate</th>
                <th>Nurse Name</th>
              </tr>
            </thead>
            <tbody>
              {data.getVitalSignsByPatientUsername
                .slice()
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((vitalSign) => (
                  <tr key={vitalSign.id}>
                    <td>
                      {new Date(parseInt(vitalSign.createdAt)).toLocaleString()}
                    </td>
                    <td>{vitalSign.bodyTemperature}</td>
                    <td>{vitalSign.heartRate}</td>
                    <td>{vitalSign.bloodPressure}</td>
                    <td>{vitalSign.respiratoryRate}</td>
                    <td>{vitalSign.nurseId}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ViewVitalSignsHistory;
