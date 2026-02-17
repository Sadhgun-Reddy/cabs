import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const AddVehicleModel = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    groupName: "",
    modelName: "",
    priority: "",
    seater: "",
  });

  // COMMON HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         image: file,
  //       }));
  //     }
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vehicle Model Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Vehicle Model</h4>
          </div>
          <Link to="/vehicleGroup" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle Model
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* DRIVER */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Group Name</label>
                  <select
                    type="text"
                    name="groupName"
                    className="form-select"
                    value={formData.groupnameName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Group Name</option>
                    <option value="Admin">Cab</option>
                    <option value="User">Sedan</option>
                    <option value="Manager">SUV</option>
                    <option value="Support">Prime SUV</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="col-md-6">
                  <label className="form-label">Model Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Model"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                {/* Decription */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Seater</label>
                  <input
                    type="text"
                    name="seatername"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Seater"
                    required
                  />
                </div>

                {/* Down Grade */}
                <div className="col-md-6">
                  <label className="form-label">Priority</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Priority"
                    value={formData.priority || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Add Vehicle Model
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModel;
