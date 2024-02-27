


import React, { useState, useEffect } from "react";
import axios from "axios";

const NumberOfStaff = ({ staffList, setShowStaffDetails }) => {
  const [updatedStaffList, setUpdatedStaffList] = useState(staffList);

  useEffect(() => {
    setUpdatedStaffList(staffList);
  }, [staffList]);

  const handleDeleteStaff = async (email) => {
    try {
     
      await axios.delete(`https://stock-backend-zht5.onrender.com/api/delete/${email}`);

      
      const filteredStaffList = updatedStaffList.filter(
        (staff) => staff.email !== email
      );
      setUpdatedStaffList(filteredStaffList);
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <div className="container p-5">
      <div className="row my-5">
        <div className="col-8">
          <h1>Staff List</h1>
        </div>
        <div className="col-4 d-flex justify-content-end">
          <button
            className="btn btn-danger"
            onClick={() => setShowStaffDetails(false)}
          >
            Cancel
          </button>
        </div>
      </div>
      {updatedStaffList.map((staffItem) => (
        <div key={staffItem.staffId} className="col-md-12 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{staffItem.name}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Email: {staffItem.email}</li>
                <li className="list-group-item">Staff ID: {staffItem.staffId}</li>
                <li className="list-group-item">Contact: {staffItem.contact}</li>
              </ul>
              <button
                className="btn btn-danger mt-2"
                onClick={() => handleDeleteStaff(staffItem.email)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NumberOfStaff;
