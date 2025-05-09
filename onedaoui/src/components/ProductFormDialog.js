import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from "@mui/material";

function ProductFormDialog({ open, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		quantity: "",
		category: "",
		available: true,
		color: "",
		size: "",
		attributes: {
			weight: "",
			brand: "",
		},
	});

	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name in formData.attributes) {
			setFormData((prev) => ({
				...prev,
				attributes: { ...prev.attributes, [name]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = () => {
		onSubmit(formData);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{initialData ? "Edit Product" : "Add Product"}</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					<Grid item xs={12} sm={6}>
						<TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleChange} />
					</Grid>
					{/* Add other fields similarly */}
					<Grid item xs={12} sm={6}>
						<TextField label="Brand" name="brand" fullWidth value={formData.attributes.brand} onChange={handleChange} />
					</Grid>
					{/* Continue adding fields for description, price, quantity, etc. */}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant="contained">
					{initialData ? "Update" : "Add"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ProductFormDialog;
