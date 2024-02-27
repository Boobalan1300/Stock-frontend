
import React from "react";
import ProductRow from "./ProductRow";

function ProductTable({ productList, handleUpdateProduct, draftProductList, handleInputChange, handleSaveUpdate, updateSuccessIndex }) {
  return (
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
          <ProductRow
            key={product._id}
            product={product}
            index={index}
            handleUpdateProduct={handleUpdateProduct}
            draftProductList={draftProductList}
            handleInputChange={handleInputChange}
            handleSaveUpdate={handleSaveUpdate}
            updateSuccessIndex={updateSuccessIndex}
          />
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;




