import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { replace, useNavigate } from "react-router-dom";
import { main_url } from "../config/config";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();
	const [error, setError] = useState(null); // State for error message

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // Clear previous errors
		try {
			const res = await fetch(main_url + "api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();
			if (res.ok) {
				sessionStorage.setItem("token", data.token); // Store token in local storage
				login(data.token); // Call login function from AuthContext
				navigate("/products", { replace: true }); // Redirect to products page
			} else {
				setError(data.message || "Login failed"); // Set error message
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
						{/* You can replace this with an actual image if you have one */}
						<h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
						<p className="text-lg">Log in to access your account</p>
					</div>
				</div>

				{/* Right Side (Login Form) */}
				<div className="md:w-1/2 p-6">
					<h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Log In to Admin Panel</h2>
					<p className="text-gray-600 mb-6 text-center">Enter your email ID and password below</p>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								EMAIL ID
							</label>
							<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email id" className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : ""}`} required />
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								PASSWORD
							</label>
							<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : ""}`} required />
						</div>
						<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
							Log In
						</button>
						{error && (
							<p className="text-red-500 text-sm text-center">{error}</p> // Display error
						)}
						<div className="text-center text-gray-600">
							Don't have an account?{" "}
							<a href="/signup" className="text-blue-500 hover:underline">
								Register
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
