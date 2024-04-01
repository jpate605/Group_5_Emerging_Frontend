import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "../authcontext.jsx";
import { useNavigate } from "react-router-dom";

const RECORD_DAILY_INFO_MUTATION = gql`
  mutation RecordDailyInfo(
    $patientUsername: String!
    $pulseRate: Float
    $bloodPressure: String
    $weight: Float
    $temperature: Float
    $respiratoryRate: Float
  ) {
    recordDailyInfo(
      patientUsername: $patientUsername
      pulseRate: $pulseRate
      bloodPressure: $bloodPressure
      weight: $weight
      temperature: $temperature
      respiratoryRate: $respiratoryRate
    ) {
      id
    }
  }
`;

function DailyInfoForm() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user
  const patientUsername = user ? user.username : null; // Use the patient's username
  const [pulseRate, setPulseRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [weight, setWeight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");

  const [recordDailyInfoMutation, { loading, error }] = useMutation(
    RECORD_DAILY_INFO_MUTATION,
    {
      onCompleted(data) {
        if (data.recordDailyInfo) {
          alert("Daily information recorded successfully.");
        }
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    recordDailyInfoMutation({
      variables: {
        patientUsername, // Use the logged-in patient's username
        pulseRate: parseFloat(pulseRate) || null,
        bloodPressure: bloodPressure || null,
        weight: parseFloat(weight) || null,
        temperature: parseFloat(temperature) || null,
        respiratoryRate: parseFloat(respiratoryRate) || null,
      },
      onCompleted: () => {
        navigate("/viewdailyinfo"); // Navigate to the ViewDailyInfo page
      },
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Record Daily Information</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Pulse Rate"
            value={pulseRate}
            onChange={(e) => setPulseRate(e.target.value)}
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
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
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
        <div className="button-container">
          <button type="submit" className="btn btn-custom btn-primary">
            Submit
          </button>

          <button
            type="button"
            className="btn btn-custom btn-secondary"
            onClick={() => navigate("/symptomschecklist")}
          >
            Add Symptoms
          </button>
        </div>
      </form>
    </div>
  );
}

export default DailyInfoForm;
