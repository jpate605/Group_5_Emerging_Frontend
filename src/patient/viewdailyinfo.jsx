import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useAuth } from "../authcontext.jsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GET_DAILY_INFO_BY_PATIENT_USERNAME_QUERY = gql`
  query GetDailyInfoByPatientUsername($patientUsername: String!) {
    getDailyInfoByPatientUsername(patientUsername: $patientUsername) {
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
    }
  }
`;

function ViewDailyInfo() {
  const { user } = useAuth();
  const patientUsername = user ? user.username : null;
  const { data, loading, error } = useQuery(
    GET_DAILY_INFO_BY_PATIENT_USERNAME_QUERY,
    {
      variables: { patientUsername },
      skip: !patientUsername,
    }
  );

  const [chartDatasets, setChartDatasets] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);

  useEffect(() => {
    if (data && data.getDailyInfoByPatientUsername) {
      // Extract chart labels (dates) directly into chartLabels state
      setChartLabels(
        data.getDailyInfoByPatientUsername.map((info) =>
          new Date(Number(info.createdAt)).toLocaleDateString()
        )
      );

      const fields = [
        "pulseRate",
        "bloodPressure",
        "weight",
        "temperature",
        "respiratoryRate",
      ];

      const fieldColors = [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
      ];

      const newDatasets = fields.map((field, index) => {
        return {
          label: `${field.charAt(0).toUpperCase() + field.slice(1)} Chart`,
          data: data.getDailyInfoByPatientUsername.map((info) =>
            Number(info[field])
          ),
          backgroundColor: fieldColors[index],
        };
      });

      const averageData = newDatasets.map((dataset) => {
        const sum = dataset.data.reduce((acc, value) => acc + value, 0);
        return sum / dataset.data.length;
      });

      const averageDataset = {
        label: "Average Chart",
        data: averageData,
        backgroundColor: fieldColors,
      };

      setChartDatasets([...newDatasets, averageDataset]);
    }
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  if (!user) {
    return <p>Please log in to view your daily information.</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <style>{`
        .chart-container {
          flex: 0 0 calc(50% - 20px);
          margin: 10px;
        }
      `}</style>
      <div className="container mt-4" style={{ backgroundColor: "white" }}>
        <h2 className="mb-4">View Daily Information</h2>
        <div
          className="chart-row"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {chartDatasets.map((dataset, index) => (
            <div key={index} className="chart-container">
              <h3>{dataset.label}</h3>
              <div style={{ height: "300px" }}>
                <Pie
                  data={{ labels: chartLabels, datasets: [dataset] }}
                  options={options}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ViewDailyInfo;
