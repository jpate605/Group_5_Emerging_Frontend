import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import "../css/register.css";

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $role: String!) {
    register(username: $username, password: $password, role: $role) {
      id
    }
  }
`;

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);

  useEffect(() => {
    if (data) {
      window.alert("Registered successfully!");
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ variables: { username, password, role } });
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error registering user: {error.message}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-control"
          >
            <option value="patient">Patient</option>
            <option value="nurse">Nurse</option>
          </select>
        </div>
        <div className="register-form-group">
          <button type="submit" className="btn btn-register">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
