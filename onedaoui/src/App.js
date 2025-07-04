import React from "react";

import VerifyOtp from "./pages/VerifyOtp";

import Products from "./pages/Products";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";

export default function App() {
	return (
		<AuthProvider>
			<ToastContainer position="top-right" autoClose={3000} />
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route path="/verify-otp" element={<VerifyOtp />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="/products"
					element={
						<ProtectedRoute>
							<Products />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/product/edit/:id"
					element={
						<ProtectedRoute>
							<EditProduct />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/product/add"
					element={
						<ProtectedRoute>
							<AddProduct />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/login" />} />
				<Route path="/" element={<Navigate to="/login" />} />
			</Routes>
		</AuthProvider>
	);
}
