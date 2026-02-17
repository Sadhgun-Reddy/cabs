import { useState } from "react";
import { Link } from "react-router-dom";

const EditFarePlan = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    farePlanName: "",
    priority: "",

  });

  // Common change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Fare Plan Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Fare Plan</h4>
          </div>
          <Link to="/fareplans" className="btn btn-secondary">
          <i className="feather icon-arrow-left me-2" />
            Back to Fare Plan
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card border mb-4">
            <div className="card-body">

              {/* Service Name */}
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <select
                  type="text"
                  name="serviceName"
                  className="form-select"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                >
                    <option></option>
                    </select>
              </div>

              {/* Fare Plan Name */}
              <div className="mb-3">
                <label className="form-label">Fare Plan Name</label>
                <input
                  type="text"
                  name="farePlanName"
                  className="form-control"
                  value={formData.farePlanName}
                  onChange={handleChange}
                  placeholder="Enter Plan Name"
                  required
                />
              </div>

              {/* Priority */}
              <div className="mb-3">
                <label className="form-label">Priority</label>
                <input
                  type="number"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                  placeholder="Enter Priority"
                />
              </div>

              {/* Down Grade */}
              {/* <div className="mb-3">
                <label className="form-label">Radius</label>
                <input
                  type="text"
                  name="radius"
                  className="form-control"
                  value={formData.radius}
                  onChange={handleChange}
                  placeholder="Enter Radius"
                />
              </div> */}

              {/* Submit Button */}
              <div className="text-end">
                <button type="submit" className="btn btn-success">
                  Update Plan
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarePlan;
