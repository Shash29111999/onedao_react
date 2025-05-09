import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State for error message


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,roleType:"admin" }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("signupEmail", email); // Store email in session storage
        navigate("/verify-otp");
      } else {
        setError(data.message || "Signup failed"); // Set error message
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred"); // Set error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        {/* Left Side (Background Image) */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-purple-900 rounded-l-xl hidden md:flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Register</h2>
            <p className="text-lg">Enter your details to create an account</p>
          </div>
        </div>

        {/* Right Side (Signup Form) */}
        <div className="md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-1 text-center text-gray-800">Register to Admin Panel</h2>
          <p className="text-gray-600 mb-8 text-center">
            Enter your email and password below
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                EMAIL ID
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email id"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your confirm password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Register
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p> // Display error
            )}
            <div className="text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

