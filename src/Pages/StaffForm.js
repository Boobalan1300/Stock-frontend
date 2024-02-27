
import React from 'react';

function StaffForm({ handleCancel, handleSubmit, handleChange, staff }) {
  return (
    <div className="container mt-2 mx-2 p-5">
      <h2>Create User Form</h2>
      <button type="button" className="btn btn-danger my-3 " onClick={handleCancel}>Cancel</button>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={staff.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={staff.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={staff.password} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="staffId" className="form-label">Staff ID</label>
          <input type="text" className="form-control" id="staffId" name="staffId" value={staff.staffId} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="adminId" className="form-label">Admin ID</label>
          <input type="text" className="form-control" id="adminId" name="adminId" value={staff.adminId} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">Contact</label>
          <input type="text" className="form-control" id="contact" name="contact" value={staff.contact} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default StaffForm;
