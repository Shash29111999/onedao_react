// 

// src/pages/Products.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";


export default function Products() {
	const [products, setProducts] = useState([]);
	const [filters, setFilters] = useState({
		name: "",
		category: "",
		minPrice: "",
		maxPrice: "",
		brand: "",
		color: "",
		available: "",
	});
	const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(5);
	const navigate = useNavigate();

	const fetchProducts = useCallback(async () => {
		const queryParams = new URLSearchParams({
			page: String(page),
			size: String(size),
			...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "")),
		}).toString();

		const res = await fetch(`http://localhost:8080/api/products?${queryParams}`, {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!res.ok) {
			console.error("Failed to fetch products:", res.status, res.statusText);
			return;
		}
		const data = await res.json();
		setProducts(data.products);
		setPagination({ totalItems: data.totalItems, totalPages: data.totalPages, currentPage: data.currentPage });
	}, [filters, page, size]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) setPage(newPage);
	};

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this product?")) return;
		await fetch(`http://localhost:8080/api/products/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});
		fetchProducts();
	};

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Products</h2>
				<button
					onClick={() => navigate("/product/add")}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					 Add Product
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
				{Object.entries(filters).map(([key, value]) => (
					<div key={key} className="flex flex-col">
						<label htmlFor={key} className="text-sm font-medium capitalize text-gray-700">
							{key}
						</label>
						<input
							id={key}
							type="text"
							placeholder={key}
							value={value}
							onChange={(e) => handleFilterChange(key, e.target.value)}
							className="p-2 border rounded"
						/>
					</div>
				))}
			</div>

			<table className="w-full table-auto border-collapse shadow">
				<thead>
					<tr className="bg-gray-200">
						<th className="border px-4 py-2">Name</th>
						<th className="border px-4 py-2">Category</th>
						<th className="border px-4 py-2">Price</th>
						<th className="border px-4 py-2">Brand</th>
						<th className="border px-4 py-2">Color</th>
						<th className="border px-4 py-2">Available</th>
						<th className="border px-4 py-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.id} className="hover:bg-gray-100">
							<td className="border px-4 py-2">{product.name}</td>
							<td className="border px-4 py-2">{product.category}</td>
							<td className="border px-4 py-2">{product.price}</td>
							<td className="border px-4 py-2">{product.attributes?.brand || "-"}</td>
							<td className="border px-4 py-2">{product.color || "-"}</td>
							<td className="border px-4 py-2">{product.available ? "Yes" : "No"}</td>
							<td className="border px-4 py-2 flex gap-2">
								<button onClick={() => navigate(`/product/edit/${product.id}`)} className="text-blue-600 hover:underline">
									edit
								</button>
								<button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
									delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="flex justify-between mt-4 items-center">
				<button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
					Prev
				</button>
				<span>
					Page {page} of {pagination.totalPages} (Total: {pagination.totalItems})
				</span>
				<button onClick={() => handlePageChange(page + 1)} disabled={page >= pagination.totalPages} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
					Next
				</button>
			</div>

			<div className="mt-4">
				<label htmlFor="size" className="mr-2">Items per page:</label>
				<select id="size" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} className="border rounded p-2">
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">50</option>
				</select>
			</div>
		</div>
	);
}
