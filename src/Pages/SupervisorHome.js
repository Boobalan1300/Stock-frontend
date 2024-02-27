
import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import ProductList from "./Product_list";
import BrandList from "./BrandList"; 

import LoginForm from "./Login";

function SupervisorPage() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [adminId, setAdminId] = useState("");
  const [productsToBeUpdatedCount, setProductsToBeUpdatedCount] = useState(0);
  const [updateFalseCount, setUpdateFalseCount] = useState(0);
  const [productList, setProductList] = useState([]);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productListLoading, setProductListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [draftProductList, setDraftProductList] = useState([]);
  const [updateSuccessIndex, setUpdateSuccessIndex] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [distinctBrands, setDistinctBrands] = useState([]);
  const [showBrandDetails, setShowBrandDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("email");
    setLoggedInUser(loggedInEmail);
    fetchSupervisorData(loggedInEmail);
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchBrandCount(adminId);
      fetchDistinctBrands(adminId);
    }
  }, [adminId]);

  useEffect(() => {
    if (updateSuccessIndex !== null) {
      setTimeout(() => {
        setUpdateSuccessIndex(null);
        setRefreshKey((prevKey) => prevKey + 1);
        fetchBrandCount(adminId); // Refresh brand count after update
      }, 2000);
    }
  }, [updateSuccessIndex]);

  const fetchSupervisorData = async (email) => {
    try {
      const response = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/supervisor/${email}`
      );
      const { adminId } = response.data;
      setAdminId(adminId);
      fetchProductsToBeUpdatedCount(adminId);
      fetchProductList(adminId);
    } catch (error) {
      console.error("Error fetching supervisor data:", error);
      setError("Error fetching supervisor data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsToBeUpdatedCount = async (adminId) => {
    try {
      const response = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/productsToBeUpdated/${adminId}`
      );
      const { count } = response.data;
      setProductsToBeUpdatedCount(count);
    } catch (error) {
      console.error("Error fetching count of products to be updated:", error);
      setError("Error fetching products to be updated");
    }
  };

  const fetchProductList = async (adminId) => {
    try {
      setProductListLoading(true);
      const response = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/products/${adminId}`
      );
      const products = response.data;
      const productsWithUpdateFlag = products.map((product) => ({
        ...product,
        isUpdating: false,
      }));
      setProductList(productsWithUpdateFlag);
      setDraftProductList(JSON.parse(JSON.stringify(productsWithUpdateFlag)));

      const falseCount = products.filter((product) => !product.update).length;
      setUpdateFalseCount(falseCount);
    } catch (error) {
      console.error("Error fetching product list:", error);
      setError("Error fetching product list");
    } finally {
      setProductListLoading(false);
    }
  };

  const fetchBrandCount = async (adminId) => {
    try {
      const response = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/brands/${adminId}`
      );
      const { brandCount } = response.data;
      setBrandCount(brandCount);
    } catch (error) {
      console.error("Error fetching brand count:", error);
      setError("Error fetching brand count");
    }
  };

  const fetchDistinctBrands = async (adminId) => {
    try {
      const response = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/distinctBrands/${adminId}`
      );
      const { distinctBrands } = response.data;
      setDistinctBrands(distinctBrands);
    } catch (error) {
      console.error("Error fetching distinct brands:", error);
      setError("Error fetching distinct brands");
    }
  };

  const handleToggleProductDetails = () => {
    setShowProductDetails(!showProductDetails);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    localStorage.setItem("isLoggedIn", "false");
    navigate("/login"); // Navigate to login form after logout
  };

  if (!localStorage.getItem("token")) {
    return <LoginForm />;
  }


  const handleUpdateProduct = (productId, index) => {
    setUpdatingProductId(productId === updatingProductId ? null : productId);
    setProductList((prevProductList) =>
      prevProductList.map((product, i) => ({
        ...product,
        isUpdating: i === index ? !product.isUpdating : false,
      }))
    );
  };
  
  const handleSaveUpdate = async (productId, updatedProductData, index) => {
    try {
      const response = await axios.put(
        `https://stock-backend-zht5.onrender.com/api/updateProduct/${productId}`,
        updatedProductData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const updatedProduct = response.data;
  
      setDraftProductList((prevDraftProductList) =>
        prevDraftProductList.map((product, i) =>
          i === index ? updatedProduct : product
        )
      );
  
      setUpdateSuccessIndex(index);
  
      setTimeout(() => {
        setProductList((prevProductList) =>
          prevProductList.map((product) =>
            product.productId === updatedProduct.productId
              ? updatedProduct
              : product
          )
        );
        setDraftProductList([]);
        fetchProductList(adminId);
        fetchProductsToBeUpdatedCount(adminId);
        fetchBrandCount(adminId); // Refresh brand count
        fetchDistinctBrands(adminId); // Refresh distinct brands
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(`Error updating product: ${error.message}`);
    }
  };
  
  const handleInputChange = (productId, fieldName, value) => {
    setDraftProductList((prevDraftProductList) =>
      prevDraftProductList.map((product) =>
        product.productId === productId
          ? { ...product, [fieldName]: value }
          : product
      )
    );
  };
  const handleToggleBrandDetails = () => {
    setShowBrandDetails(!showBrandDetails);
  };
  
  return (
    <div key={refreshKey} className="container">
      <div className="container text-center">
        <h1>Welcome Supervisor Page!</h1>
        <p>Logged in as: {loggedInUser}</p>
        <p>Admin ID: {adminId}</p>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="container mt-2 mx-2 p-5">
        <div className="row text-white text-center">
          <div className="d-flex justify-content-center">
            <div className="col-md-3 me-2 bg-primary p-4 rounded-3 align-items-center">
              <h3>Have to Update</h3>
              <div className="d-flex justify-content-evenly align-items-center">
                <span className="mt-3 badge rounded-pill p-3 bg-light text-dark">
                  {productsToBeUpdatedCount}
                </span>
                <button
                  className="btn btn-success mt-3"
                  onClick={handleToggleProductDetails}
                >
                  View
                </button>
              </div>
            </div>

            <div className="col-md-3 me-2 bg-primary p-4 rounded-3 align-items-center">
              <h3>Number Of Brands</h3>
              <div className="d-flex justify-content-evenly align-items-center">
                <span className="mt-3 badge rounded-pill p-3 bg-light text-dark">
                  {brandCount}
                </span>
                <button
                  className="btn btn-success mt-3"
                  onClick={handleToggleBrandDetails} // Add an onClick handler for toggling brand details
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProductDetails && (
        <ProductList
          productList={productList}
          productListLoading={productListLoading}
          handleUpdateProduct={handleUpdateProduct}
          updatingProductId={updatingProductId}
          draftProductList={draftProductList}
          handleInputChange={handleInputChange}
          handleSaveUpdate={handleSaveUpdate}
          updateSuccessIndex={updateSuccessIndex}
        />
      )}

      {/* Display BrandList component with distinctBrands */}
      {showBrandDetails && (
        <BrandList
          distinctBrands={distinctBrands}
        />
      )}
    </div>
  );
}

export default SupervisorPage;

