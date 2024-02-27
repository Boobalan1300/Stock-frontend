


import React, { useState } from 'react';
import axios from 'axios';

function ProductForm({ handleCancel, handleProductAdded }) {
  const [product, setProduct] = useState({
    image: null,
    productId: '',
    productName: '',
    cost: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files && files.length > 0) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: files[0],
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('image', product.image);
    formData.append('productId', product.productId);
    formData.append('productName', product.productName);
    formData.append('cost', product.cost);

    try {
      const response = await axios.post(
        "https://stock-backend-zht5.onrender.com/api/products",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("Product added successfully:", response.data);
      handleProductAdded(); 
      resetFields(); 
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const resetFields = () => {
    setProduct({
      image: null,
      productId: '',
      productName: '',
      cost: '',
    });
  };

  return (
    <div className="container mt-2 mx-2 p-5">
      <h2>Add Product Form</h2>
      <button type="button" className="btn btn-danger  my-4" onClick={handleCancel}>
        Cancel
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input type="file" className="form-control" id="image" name="image" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="productId" className="form-label">
            Product ID
          </label>
          <input type="text" className="form-control" id="productId" name="productId" value={product.productId} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name
          </label>
          <input type="text" className="form-control" id="productName" name="productName" value={product.productName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="cost" className="form-label">
            Cost
          </label>
          <input type="number" className="form-control" id="cost" name="cost" value={product.cost} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
