
import { useState } from "react";
import { Link } from "react-router-dom";

const AddSurgePrice = () => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    day: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        
        {/* Page Header */}
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4>Add Surge Price</h4>
            {/* <h6 className="text-muted">Update surge pricing details</h6> */}
          </div>
          <Link to="/surgePrices" className="btn btn-light">
            <i className="ti ti-arrow-left me-1" /> Back to Surge Prices
          </Link>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              
              {/* Start Time & End Time - Same Row */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Start Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    className="form-control"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    End Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    className="form-control"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Day Dropdown */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Day <span className="text-danger">*</span>
                  </label>
                  <select
                    name="day"
                    className="form-select"
                    value={formData.day}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Status
                  </label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-3">
                {/* <Link
                  to="/surgePrices"
                  className="btn btn-light me-2"
                >
                  Cancel
                </Link> */}
                <button type="submit" className="btn btn-primary">
                  <i className="ti ti-device-floppy me-1" />
                  Add Price
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddSurgePrice;