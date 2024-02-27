
import React, { useState, useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import StaffForm from "./StaffForm";
import NumberOfStaff from "./NumberOfStaff";
import ProductForm from "./ProductForm";
import BrandList from "./BrandList";
import ProductList from "./Product_list";
import LoginForm from "./Login";

function AdminHome() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [staffCount, setStaffCount] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [productAdded, setProductAdded] = useState(false); 
  const [distinctBrands, setDistinctBrands] = useState([]);
  const [showBrandDetails, setShowBrandDetails] = useState(false);
  const [brandCount, setBrandCount] = useState(0);
  const [error, setError] = useState(null);

  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [draftProductList, setDraftProductList] = useState([]);
  const [updateSuccessIndex, setUpdateSuccessIndex] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loggedInUser, setLoggedInUser] = useState("");

  const [productsToBeUpdatedCount, setProductsToBeUpdatedCount] = useState(0);
  const [productList, setProductList] = useState([]);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [productListLoading, setProductListLoading] = useState(false);


  const navigate = useNavigate();

  
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    password: "",
    staffId: "",
    adminId: "",
    contact: "",
  });

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("email");
    // setLoggedInUser(loggedInEmail);
    fetchAdminData(loggedInEmail);
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
        fetchBrandCount(adminId); 
      }, 2000);
    }
  }, [updateSuccessIndex]);

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

  useEffect(() => {
    if (adminId) {
      const fetchStaff = async () => {
        try {
          const response = await axios.get(
            `https://stock-backend-zht5.onrender.com/api/staff/${adminId}`
          );
          setStaffList(response.data);
          setStaffCount(response.data.length);
        } catch (error) {
          console.error("Error fetching staff data:", error);
        }
      };

      fetchStaff();
    }
  }, [adminId]);

  if (!localStorage.getItem("token")) {
    return <LoginForm />;
  }

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

    // Check if user is logged in, if not, render the LoginForm component
 

  const handleCreateUserClick = () => {
    setShowCreateUserForm(true);
  };


  const handleProductFormClick = () => {
    setShowProductForm(true);
  };

  const handleCreateUserCancel = () => {
    setShowCreateUserForm(false);
    resetStaffState(); // Reset the staff state
  };

  const handleProductFormCancel = () => {
    setShowProductForm(false);
  };

  const resetStaffState = () => {
    setStaff({
      name: "",
      email: "",
      password: "",
      staffId: "",
      adminId: "",
      contact: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://stock-backend-zht5.onrender.com/api/staff",
        staff
      );
      console.log("Staff data stored successfully:", response.data);
      setShowCreateUserForm(false);

      // Refetch staff data after a new staff is added
      const updatedStaffResponse = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/staff/${adminId}`
      );
      setStaffList(updatedStaffResponse.data);
      setStaffCount(updatedStaffResponse.data.length);
    } catch (error) {
      console.error("Error storing staff data:", error);
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
      // setError("Error fetching brand count");
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
      // setError("Error fetching distinct brands");
    }
  };

  const handleProductAdded = async () => {
    setProductAdded(true);
    try {

      await fetchProductList(adminId);
      await fetchProductsToBeUpdatedCount(adminId);
    } catch (error) {
      console.error("Error refreshing product list:", error);
      setError("Error refreshing product list");
    }
    setTimeout(() => {
      setProductAdded(false);
      setShowProductForm(false);
    }, 2000); 
  };

  const handleToggleBrandDetails = () => {
    setShowBrandDetails(!showBrandDetails);
  };

  const handleUpdateProduct = (productId, index) => {
    setUpdatingProductId(productId === updatingProductId ? null : productId);
    setProductList((prevProductList) =>
      prevProductList.map((product, i) => ({
        ...product,
        isUpdating: i === index ? !product.isUpdating : false,
      }))
    );
  };

  const handleToggleProductDetails = () => {
    setShowProductDetails(!showProductDetails);
  };

  const fetchAdminData = async (email) => {
    try {
      const response = await axios.get(
        `https://stock-backend-zht5.onrender.com/api/adminId/${email}`
      );
      const { adminId } = response.data;
      setAdminId(adminId);
      fetchProductsToBeUpdatedCount(adminId);
      fetchProductList(adminId);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Error fetching admin data");
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
    } catch (error) {
      console.error("Error fetching product list:", error);
      setError("Error fetching product list");
    } finally {
      setProductListLoading(false);
    }
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
        fetchBrandCount(adminId); 
        fetchDistinctBrands(adminId); 
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

  return (
    <div key={refreshKey} className="container gradient-background">
      <div className="container text-center ">
        <h1>Welcome AdminHome Page!</h1>
        <p>Logged in as: {localStorage.getItem("email")}</p>
        <p>Admin ID: {adminId}</p>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
        <Link to="/search" className="btn btn-secondary ms-3">
          Go to Search Page
        </Link>
      </div>
      <div className="container mt-2 mx-2 p-5">
        <div className="row text-white text-center justify-content-evenly">
          <div className="col-md-3 mx-2  my-2 col-sm-6 shadow  bg-primary p-4 rounded-3 align-items-center">
            <h3>Number of Staffs</h3>
            <div className="d-flex justify-content-evenly align-items-center">
              <span className="mt-3 me-2  badge rounded-pill p-3 bg-light text-dark">
                {staffCount}
              </span>
              <button
                className="btn btn-success mt-3"
                onClick={() => setShowStaffDetails(!showStaffDetails)}
              >
                View
              </button>
            </div>
          </div>

          <div className="col-md-3 col-sm-5 my-2 shadow  bg-primary p-4 rounded-3 align-items-center">
            <h3>Number Of Brands</h3>
            <div className="d-flex justify-content-evenly align-items-center">
              <span className="mt-3 me-2 badge rounded-pill p-3 bg-light text-dark">
                {brandCount}
              </span>
              <button
                className="btn btn-success mt-3"
                onClick={handleToggleBrandDetails}
              >
                View
              </button>
            </div>
          </div>
          

          <div className="col-md-3 mx-2  my-2 col-sm-6 shadow  bg-primary p-4 rounded-3 align-items-center">
            <h3>Have to Update</h3>
            <div className="d-flex justify-content-evenly align-items-center">
              <span className="mt-3 me-2 badge rounded-pill p-3 bg-light text-dark">
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


          
        </div>
        
      </div>
      

      <div className="container mx-2  p-5">
        <div className="row text-white text-center">
          <div className="d-flex justify-content-center ">
            <div className="col-md-3 col-sm-5 shadow me-2 bg-info p-4 rounded-3 align-items-center">
              <div>
                <h3 className="mb-3">Create user</h3>
                <button
                  className="btn btn-success"
                  onClick={handleCreateUserClick}
                >
                  Create User
                </button>
              </div>
            </div>

            <div className="col-md-3 shadow me-2 bg-info p-4 rounded-3 align-items-center ">
              <div>
                <h3>Add Products</h3>
                <button
                  className="btn btn-success"
                  onClick={handleProductFormClick}
                >
                  ADD +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStaffDetails && (
        <NumberOfStaff
          staffList={staffList}
          setShowStaffDetails={setShowStaffDetails}
          setStaffLists={setStaffList}
        />
      )}

      {showCreateUserForm && (
        <StaffForm
          handleCancel={handleCreateUserCancel}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          staff={staff}
        />
      )}

      {productAdded && (
        <p className="text-success mt-3">Product added successfully!</p>
      )}

      {showProductForm && (
        <ProductForm
          handleCancel={handleProductFormCancel}
          adminId={adminId}
          setStaffList={setStaffList}
          setStaffCount={setStaffCount}
          handleProductAdded={handleProductAdded} 
        />
      )}

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

      {showBrandDetails && <BrandList distinctBrands={distinctBrands} />}
    </div>
  );
}

export default AdminHome;
