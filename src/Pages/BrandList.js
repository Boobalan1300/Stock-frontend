import React from "react";

function BrandList({ distinctBrands }) {
  return (
    <div className="container d-flex justify-content-center align-items-start min-vh-100">
      <div className="p-4  rounded shadow bg-warning" style={{ minWidth: "300px"}}>
        <h2 className="fs-5 text-success text-center mb-4">Distinct Brands</h2>
        <ul className="list-group">
          {distinctBrands.map((brand, index) => (
            <li key={index} className="list-group-item mb-3 shadow">
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BrandList;
