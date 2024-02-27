import React from "react";

const ProductList = ({
  productList,
  productListLoading,
  handleUpdateProduct,
  updatingProductId,
  draftProductList,
  handleInputChange,
  handleSaveUpdate,
  updateSuccessIndex,
}) => (
  <div>
    <h2>Product List</h2>
    {productListLoading ? (
      <p>Loading...</p>
    ) : (
      <table className="table">
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Cost</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={product._id}>
              <td>{product.productCode}</td>
              <td>{product.productName}</td>
              <td>{product.cost}</td>
              <td>
                <img
                  src={`data:image/png;base64,${product.image}`}
                  alt={product.productName}
                  style={{ maxWidth: "100px" }}
                />
              </td>
              <td>
                <button
                  className={`btn ${
                    product.update ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => handleUpdateProduct(product.productId, index)}
                >
                  {product.update
                    ? "Update Completed"
                    : product.isUpdating &&
                      updatingProductId === product.productId
                    ? "Cancel"
                    : "Update"}
                </button>

                {product.isUpdating &&
                  updatingProductId === product.productId && (
                    <div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="productName" className="form-label">
                              Product Name:
                            </label>
                            <input
                              type="text"
                              id="productName"
                              name="productName"
                              value={draftProductList[index]?.productName || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "productName",
                                  e.target.value
                                )
                              }
                              className="form-control"
                            />
                          </div>


                          <div className="mb-3">
                            <label htmlFor="category" className="form-label">
                              Category:
                            </label>
                            <select
                              id="category"
                              name="category"
                              value={draftProductList[index]?.category || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "category",
                                  e.target.value
                                )
                              }
                              className="form-select"
                            >
                              <option value="">Select Category</option>
                              <option value="Electronic">Electronic</option>
                              <option value="Grocery">Grocery</option>
                              <option value="Dress">Dress</option>
                            </select>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="subcategory" className="form-label">
                              Subcategory:
                            </label>
                            <select
                              id="subcategory"
                              name="subcategory"
                              value={draftProductList[index]?.subcategory || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "subcategory",
                                  e.target.value
                                )
                              }
                              className="form-select"
                            >
                              <option value="">Select Subcategory</option>
                              {draftProductList[index]?.category ===
                              "Electronic" ? (
                                <>
                                  <option value="EarPhone">EarPhone</option>
                                  <option value="Mobile">Mobile</option>
                                  <option value="Laptop">Laptop</option>
                                  <option value="TV">TV</option>
                                </>
                              ) : draftProductList[index]?.category ===
                                "Grocery" ? (
                                <>
                                  <option value="Oil">Oil</option>
                                  <option value="Fresh Fruits">
                                    Fresh Fruits
                                  </option>
                                  <option value="Snacks">Snacks</option>
                                  <option value="Grains">Grains</option>
                                  <option value="Beverages">Beverages</option>
                                </>
                              ) : draftProductList[index]?.category ===
                                "Dress" ? (
                                <>
                                  <option value="Mens-wear">Mens-wear</option>
                                  <option value="Women-wear">Women-wear</option>
                                  <option value="Kids-wear">Kids-wear</option>
                                </>
                              ) : null}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                              Description:
                            </label>
                            <input
                              type="text"
                              id="description"
                              name="description"
                              value={draftProductList[index]?.description || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="form-control"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="brandName" className="form-label">
                              Brand Name:
                            </label>
                            <input
                              type="text"
                              id="brandName"
                              name="brandName"
                              value={draftProductList[index]?.brandName || ""}
                              F
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "brandName",
                                  e.target.value
                                )
                              }
                              className="form-control"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                              Date:
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={draftProductList[index]?.date || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="form-control"
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="productStatus"
                              className="form-label"
                            >
                              Product Status:
                            </label>
                            <select
                              id="productStatus"
                              name="productStatus"
                              value={
                                draftProductList[index]?.productStatus || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "productStatus",
                                  e.target.value
                                )
                              }
                              className="form-select"
                            >
                              <option value="">Select Product Status</option>
                              <option value="Pending">Pending</option>
                              <option value="Sold">Sold</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3 form-check">
                            <input
                              type="checkbox"
                              id="update"
                              name="update"
                              checked={draftProductList[index]?.update || false}
                              onChange={(e) =>
                                handleInputChange(
                                  product.productId,
                                  "update",
                                  e.target.checked
                                )
                              }
                              className="form-check-input"
                            />
                            <label
                              htmlFor="update"
                              className="form-check-label"
                            >
                              Update
                            </label>
                          </div>

                          <button
                            className="btn btn-success"
                            onClick={() =>
                              handleSaveUpdate(
                                product.productCode,
                                {
                                  productName:
                                    draftProductList[index]?.productName,
                                  cost: draftProductList[index]?.cost,
                                  category: draftProductList[index]?.category,
                                  subcategory:
                                    draftProductList[index]?.subcategory,
                                  description:
                                    draftProductList[index]?.description,
                                  brandName: draftProductList[index]?.brandName,
                                  date: draftProductList[index]?.date,
                                  productStatus:
                                    draftProductList[index]?.productStatus,
                                  productCode:
                                    draftProductList[index]?.productCode,
                                  image: draftProductList[index]?.image,
                                  update: draftProductList[index]?.update,
                                },
                                index
                              )
                            }
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                {updateSuccessIndex === index && (
                  <td colSpan="4">Updated Successfully</td>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ProductList;
