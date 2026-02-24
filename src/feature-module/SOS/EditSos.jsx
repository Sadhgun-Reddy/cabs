import { useState } from "react";
import { Link } from "react-router-dom";

const EditSos = () => {
  const [status, setStatus] = useState(true);

  const [formData, setFormData] = useState({
    image: null,
    title: "",
    phone: "",
    zones: "",
  });

  // COMMON INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE HANDLER
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SOS Data:", { ...formData, status });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Edit SOS</h4>
          <Link to="/SOS" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to SOS
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card border mb-4">
            <div className="card-body">
              <div className="row">

                {/* SOS Image */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">SOS Image</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>

                {/* Title */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter SOS Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Zones */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Zones</label>
                  <select
                    name="zones"
                    className="form-select"
                    value={formData.zones}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Zone</option>
                    <option value="hyderabad">Hyderabad</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6 mt-3">
                  <label className="form-label">Status</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={status}
                      onChange={() => setStatus(!status)}
                    />
                    <label className="form-check-label ms-2">
                      {status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-outline-success">
                  Update SOS
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSos;
