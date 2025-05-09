import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { main_url } from '../config/config';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${main_url}api/products/${parseInt(id)}`, {
        method: 'GET',
        headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
      
      });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${main_url}api/products/${parseInt(id)}`, {
        method: 'PUT',
        headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to update product');
      alert('Product updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input className="border p-2 rounded" name="name" value={product.name} onChange={handleChange} placeholder="Name" />
        <textarea className="border p-2 rounded" name="description" value={product.description} onChange={handleChange} placeholder="Description" />
        <input className="border p-2 rounded" type="number" step="0.01" name="price" value={product.price} onChange={handleChange} placeholder="Price" />
        <input className="border p-2 rounded" type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity" />
        <input className="border p-2 rounded" name="category" value={product.category} onChange={handleChange} placeholder="Category" />
        <input className="border p-2 rounded" name="color" value={product.color} onChange={handleChange} placeholder="Color" />
        <input className="border p-2 rounded" name="size" value={product.size} onChange={handleChange} placeholder="Size" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="available" checked={product.available} onChange={(e) => setProduct((prev) => ({ ...prev, available: e.target.checked }))} />
          Available
        </label>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2 rounded" name="weight" value={product.attributes.weight} onChange={handleNestedChange} placeholder="Weight" />
          <input className="border p-2 rounded" name="brand" value={product.attributes.brand} onChange={handleNestedChange} placeholder="Brand" />
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
