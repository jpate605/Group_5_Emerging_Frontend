import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authcontext.jsx";
import "../css/header.css";
import logo from "../images/Logo1.jpeg";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          HealthApp{" "}
          <img src={logo} alt="HealthApp Logo" style={{ height: "30px" }} />
        </Link>
      </div>
      <nav className="navigation">
        <Link to="/home">Home</Link>
        {user ? (
          <>
            <span className="username-display">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
