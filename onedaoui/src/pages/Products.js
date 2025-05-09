import React, { useState, useEffect, useCallback } from "react";
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Stack } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import ProductFormDialog from "../components/ProductFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";

function Products() {
	const [products, setProducts] = useState([]);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [openForm, setOpenForm] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const fetchProducts = useCallback(async () => {
		try {
			const res = await fetch("http://localhost:8080/api/products", {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) throw new Error("Failed to fetch products");
			const data = await res.json();
			setProducts(data.products);
		} catch (error) {
			toast.error(error.message);
		}
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleAdd = () => {
		setSelectedProduct(null);
		setOpenForm(true);
	};

	const handleEdit = (product) => {
		setSelectedProduct(product);
		setOpenForm(true);
	};

	const handleDelete = async () => {
		try {
			const res = await fetch(`http://localhost:8080/api/products/${selectedProduct.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			});
			if (!res.ok) throw new Error("Failed to delete product");
			toast.success("Product deleted successfully");
			fetchProducts();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setOpenConfirm(false);
		}
	};

	const handleFormSubmit = async (productData) => {
		try {
			const method = selectedProduct ? "PUT" : "POST";
			const url = selectedProduct ? `http://localhost:8080/api/products/${selectedProduct.id}` : "http://localhost:8080/api/products";
			const res = await fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productData),
			});
			if (!res.ok) throw new Error("Failed to save product");
			toast.success(selectedProduct ? "Product updated successfully" : "Product added successfully");
			fetchProducts();
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h6">Products</Typography>
				<Button variant="contained" onClick={handleAdd}>
					Add Product
				</Button>
			</Stack>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						{/* Add other headers */}
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products.map((product) => (
						<TableRow key={product.id}>
							<TableCell>{product.name}</TableCell>
							{/* Add other cells */}
							<TableCell>
								<Button onClick={() => handleEdit(product)}>Edit</Button>
								<Button
									onClick={() => {
										setSelectedProduct(product);
										setOpenConfirm(true);
									}}
								>
									DeleteIcon
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<ConfirmDialog open={openConfirm} onClose={() => setOpenConfirm(false)} onConfirm={handleDelete} title="Delete Product" content={`Are you sure you want to delete ${selectedProduct?.name}?`} />
			<ProductFormDialog open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleFormSubmit} initialData={selectedProduct} />
		</Paper>
	);
}

export default Products;
