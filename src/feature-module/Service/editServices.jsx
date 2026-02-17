import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const EditServiceCategory = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    language: "",
    image: null,
    name: "",
    description: "",
    service: "",
    status: "true",
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
        image: file,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Edit Service Category</h4>
          </div>
          <Link to={route.serviceCategorie} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Service Category
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* Language */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Language</label>

                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleImageChange}
                    placeholder="Enter Language"
                    className="form-control"
                  />
                </div>

                {/* DOCUMENT IMAGE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Image</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      id="documentImage"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                    <label htmlFor="documentImage" className="upload-label">
                      <i className="feather icon-plus fs-20"></i>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EXPIRY DATE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Service</label>
                  <select
                    type="text"
                    className="form-control"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option>Select</option>
                    <option>Cab</option>
                    <option>Parcel</option>
                    <option>Ambulance</option>
                  </select>
                </div>

                {/* STATUS */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <div className="form-check form-switch d-flex align-items-center gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="statusSwitch"
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked,
                        })
                      }
                    />

                    <label
                      className={`form-check-label fw-medium ${
                        formData.status ? "text-success" : "text-muted"
                      }`}
                      htmlFor="statusSwitch"
                    >
                      {formData.status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Save and Exit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* IMAGE UPLOAD STYLES */}
      <style>{`
        .upload-box {
          width: 150px;
          height: 150px;
          border: 2px dashed #dee2e6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .upload-label {
          font-size: 28px;
          color: #6c757d;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EditServiceCategory;
