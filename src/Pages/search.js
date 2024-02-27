









import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const [hideCategory, setHideCategory] = useState(false);
  const [showSelectedCategoryResults, setShowSelectedCategoryResults] = useState(false);

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("email");
    const fetchAdminId = async () => {
      try {
        const response = await axios.get(
          `https://stock-backend-zht5.onrender.com/api/adminId/${loggedInEmail}`
        );
        setAdminId(response.data.adminId);
      } catch (error) {
        console.error("Error fetching adminId:", error);
      }
    };

    fetchAdminId();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setCategory(""); 
      const url = `https://stock-backend-zht5.onrender.com/api/searchProducts/${adminId}`;
      const response = await axios.get(url);
      setProducts(response.data);
      setShowResults(true);
      setShowCategory(false);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId && showResults) {
      handleSearch();
    }
  }, [adminId, showResults]);

  const handleCancel = () => {
    setShowResults(false);
    setShowSelectedCategoryResults(false);
    setCategory("");
  };

  const handleCategoryCancel = () => {
    setCategory("");
    setShowCategory(false);
    setShowResults(false);
    setShowSelectedCategoryResults(false);
  };

  const toggleCategory = () => {
    setShowCategory(!showCategory);
    setHideCategory(false);
    setShowSelectedCategoryResults(false);
  };

  const handleCategorySearch = async () => {
    try {
      setLoading(true);
      const url = `https://stock-backend-zht5.onrender.com/api/searchProductsByCategory/${adminId}/${category}`;
      const response = await axios.get(url);
      setProducts(response.data);
      setShowResults(false);
      setShowSelectedCategoryResults(true);
    } catch (error) {
      console.error("Error searching products by category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-5 text-center">Search Page</h1>
      <Link to="/admin-dashboard" className="btn btn-secondary ms-3">
        Go back to Admin Page
      </Link>

      <nav className="mt-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${showResults && !showCategory ? "active" : ""}`}
              onClick={handleSearch}
            >
              All Products
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link`} onClick={toggleCategory}>
              Category
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : showResults ? (
          <div>
            <div>
              <h1 className="text-success my-3">All Products Result</h1>
              <button className="btn btn-secondary bg-danger mb-4" onClick={handleCancel}>Cancel</button>
            </div>
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={`data:image/png;base64,${product.image}`}
                        alt={product.productName}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.subcategory}</td>
                    <td>{product.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        {showCategory && (
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Select Category:
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Electronic">Electronic</option>
              <option value="Grocery">Grocery</option>
              <option value="Dress">Dress</option>
            </select>
            <button
              className="btn btn-primary col-2 my-3 me-3"
              onClick={handleCategorySearch}
            >
              Search
            </button>
            <button
              className="btn btn-danger col-2 my-3"
              onClick={handleCategoryCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {showSelectedCategoryResults && (
        <div className="mt-5">
          <div>
            <h2 className="text-success">Products for Category: {category}</h2>
          </div>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={`data:image/png;base64,${product.image}`}
                      alt={product.productName}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.subcategory}</td>
                  <td>{product.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Search;
