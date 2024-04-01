import React from "react";
import { AuthProvider } from "./authcontext.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import HomePage from "./pages/homepage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import RecordVitalSigns from "./nursecomponents/recordVitalSigns.jsx";
import ViewVitalSignsHistory from "./nursecomponents/viewVitalSigns.jsx";
import SymptomsForm from "./patient/symptomschecklist.jsx";
import DailyInfoForm from "./patient/dailyinfoform.jsx";
import ViewDailyInfo from "./patient/viewdailyinfo.jsx";
import SymptomsChecklist from "./patient/symptomschecklist.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recordvitalsigns" element={<RecordVitalSigns />} />
          <Route path="/viewvitalsigns" element={<ViewVitalSignsHistory />} />
          <Route path="/daily-info" element={<DailyInfoForm />} />
          <Route path="/symptoms" element={<SymptomsForm />} />
          <Route path="/viewdailyinfo" element={<ViewDailyInfo />} />
          <Route path="/symptomschecklist" element={<SymptomsChecklist />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
