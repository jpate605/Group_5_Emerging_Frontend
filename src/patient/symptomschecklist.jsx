import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useAuth } from "../authcontext.jsx";
import { Line } from "react-chartjs-2";
import "../css/symptoms.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RECORD_SYMPTOMS_MUTATION = gql`
  mutation RecordSymptoms($patientUsername: String!, $symptomsList: [String]!) {
    recordSymptoms(
      patientUsername: $patientUsername
      symptomsList: $symptomsList
    ) {
      id
      symptomsList
      createdAt
    }
  }
`;

const GET_SYMPTOMS_BY_PATIENT_USERNAME_QUERY = gql`
  query GetSymptomsByPatientUsername($patientUsername: String!) {
    getSymptomsByPatientUsername(patientUsername: $patientUsername) {
      id
      symptomsList
      createdAt
    }
  }
`;

const possibleSymptoms = [
  "Fever",
  "Cough",
  "Fatigue",
  "Headache",
  "Sore throat",
  "Shortness of breath",
];

function SymptomsChecklist() {
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const { data, loading, refetch } = useQuery(
    GET_SYMPTOMS_BY_PATIENT_USERNAME_QUERY,
    {
      variables: { patientUsername: user?.username },
      skip: !user?.username,
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (!loading && data) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const recentData = data.getSymptomsByPatientUsername
        .map((record) => ({
          ...record,
          createdAt: new Date(Number(record.createdAt)),
        }))
        .filter((record) => record.createdAt > oneWeekAgo);

      const chartData = {
        labels: recentData.map((d) => d.createdAt.toLocaleDateString()),
        datasets: possibleSymptoms.map((symptom, index) => ({
          label: symptom,
          data: recentData.map((d) =>
            d.symptomsList.includes(symptom) ? 1 : 0
          ),
          borderColor: `hsl(${index * 60}, 100%, 50%)`,
          backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.5)`,
          fill: false,
          tension: 0.1,
        })),
      };

      setChartData(chartData);
    }
  }, [data, loading]);

  const [recordSymptoms] = useMutation(RECORD_SYMPTOMS_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom to record.");
      return;
    }
    try {
      await recordSymptoms({
        variables: {
          patientUsername: user.username,
          symptomsList: selectedSymptoms,
        },
      });
    } catch (error) {
      console.error("Error recording symptoms:", error);
    }
  };

  const handleCheckboxChange = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          callback: function (val, index) {
            return val === 1 ? "Present" : "Absent";
          },
        },
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Symptom Trends Over Time",
      },
      tooltip: {
        callbacks: {
          afterBody: function (context) {
            return context[0].raw === 1
              ? "Symptom reported"
              : "No symptom reported";
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3,
        borderWidth: 2,
        hoverRadius: 5,
        hoverBorderWidth: 2,
      },
    },
    maintainAspectRatio: false,
  };

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="symptoms-form-container">
      <h2 className="symptoms-form-title">Record Symptoms</h2>
      <form onSubmit={handleSubmit} className="symptoms-form">
        {possibleSymptoms.map((symptom, index) => (
          <div key={index} className="symptoms-form-group">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedSymptoms.includes(symptom)}
              onChange={() => handleCheckboxChange(symptom)}
              id={`checkbox-${index}`}
            />
            <label className="form-check-label" htmlFor={`checkbox-${index}`}>
              {symptom}
            </label>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Record Symptoms
        </button>
      </form>
      {data && !loading && (
        <div
          className="chart-container"
          style={{ position: "relative", height: "40vh" }}
        >
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

export default SymptomsChecklist;
