import React, { useState } from "react";
import { main_url } from "../config/config";

const AddProduct = () => {
  const [product, setProduct] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("attributes.")) {
      const attrName = name.split(".")[1];
      setProduct((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attrName]: value,
        },
      }));
    } else if (name === "available") {
      setProduct({ ...product, available: value === "true" });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(main_url + "api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to create product");

      alert("Product created successfully!");
      setProduct({
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
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["name", "Product Name"],
          ["description", "Description"],
          ["price", "Price"],
          ["quantity", "Quantity"],
          ["category", "Category"],
          ["color", "Color"],
          ["size", "Size"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type={field === "price" || field === "quantity" ? "number" : "text"}
              name={field}
              value={product[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}

        {/* Dropdown for available */}
        <div>
          <label className="block font-medium mb-1">Available</label>
          <select
            name="available"
            value={product.available.toString()}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        {/* Nested attributes */}
        <div>
          <label className="block font-medium mb-1">Weight</label>
          <input
            type="text"
            name="attributes.weight"
            value={product.attributes.weight}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Brand</label>
          <input
            type="text"
            name="attributes.brand"
            value={product.attributes.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
