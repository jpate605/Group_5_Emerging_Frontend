import React from "react";
import "../css/homepage.css";

function HomePage() {
  return (
    <div className="home-container homepage-background text-container .text-content">
      <h1 className="home-title">
        Welcome to HealthTrack - Your Personal Health Monitoring App!
      </h1>
      <p className="home-description">
        HealthTrack is here to assist nurse practitioners and patients alike in
        monitoring health and wellness. Whether you're a nurse needing to track
        vital signs and review past clinical data or a patient looking to log
        daily health metrics and access helpful resources, HealthTrack has you
        covered.
      </p>
      <p className="home-description">
        For nurses, HealthTrack offers a seamless way to input vital signs such
        as body temperature, heart rate, blood pressure, and respiratory rate.
        You can also access and review previous clinical visit data to provide
        the best care possible. Using advanced technologies, HealthTrack can
        even generate a list of possible medical conditions based on symptoms,
        helping you make informed decisions and provide the best advice to your
        patients.
      </p>
      <p className="home-description">
        Patients can easily log daily health information like pulse rate, blood
        pressure, weight, temperature, and respiratory rate. Our app also
        features a symptom checklist, including common signs and symptoms such
        as those related to COVID-19, allowing you to track your health status
        and seek help if needed. Additionally, HealthTrack offers fitness games
        designed to motivate and encourage you to stay active and healthy while
        at home.
      </p>
      <p className="home-description">
        With HealthTrack, taking charge of your health has never been easier.
        Start monitoring your health today for a better tomorrow!
      </p>
    </div>
  );
}

export default HomePage;
