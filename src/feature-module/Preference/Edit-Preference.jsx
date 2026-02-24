
import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const EditPreference = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    name: "",
    priority: "",
    status: "pending",
  });

  // COMMON HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        documentImage: file,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Preference Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Preference</h4>
          </div>
          <Link to={route.preferences} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Preference
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">

                {/* DOCUMENT IMAGE */}
                {/* <div className="col-md-4 mb-3">
                  <label className="form-label">Image</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      id="documentImage"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                      required
                    />
                    <label htmlFor="documentImage" className="upload-label">
                      <i className="feather icon-plus"></i>
                    </label>
                  </div>
                </div> */}

                {/* DRIVER */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                  />

                </div>

                {/* Priority */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Priority</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.priority}
                    onChange={handleChange}
                    placeholder="Enter Priority"
                    required
                  />
                </div>

                {/* EXPIRY DATE */}
                {/* <div className="col-md-4 mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    className="form-control"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                {/* STATUS */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="select">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                   Update
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default EditPreference;
