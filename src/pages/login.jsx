import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authcontext.jsx"; // Adjust the import path as needed
import "../css/login.css";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      role
      username
    }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext

  useEffect(() => {
    if (data && data.login) {
      login({ username: data.login.username, role: data.login.role }); // Pass user data to login function
      if (data.login.role === "nurse") {
        window.alert("Login successful! Welcome, Nurse.");
        navigate("/recordvitalsigns");
      } else if (data.login.role === "patient") {
        window.alert("Login successful! Welcome, Patient.");
        navigate("/daily-info");
      }
    }
  }, [data, navigate, login]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ variables: { username, password } });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-form-group">
          <button type="submit">Login</button>
        </div>
      </form>
      {loading && <p className="login-loading">Loading...</p>}
      {error && (
        <p className="login-error">Error logging in: {error.message}</p>
      )}
    </div>
  );
}

export default Login;
