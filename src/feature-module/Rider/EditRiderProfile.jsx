
import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const EditRiderProfile = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    profileImage: null,
    name: "",
    email: "",
    phone: "",
    status: "",
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
        profileImage: file,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rider Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Rider Profile</h4>
          </div>
          <Link to={route.Allriders} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Rider 
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">

                {/* Profile IMAGE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Profile Image</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                    <label htmlFor="profileImage" className="upload-label">
                      <i className="feather icon-plus"></i>
                    </label>
                  </div>
                </div>

                {/* DRIVER */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    name="rider"
                    className="form-control"
                    value={formData.rider}
                    onChange={handleChange}
                    required
                  />


                </div>

                {/* Email */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Phone */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Phone number</label>
                  <input
                    type="text"
                    name="phonenumber"
                    className="form-control"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* STATUS */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Select</option>
                    <option value="approved">Active</option>
                    <option value="rejected">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Save
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

export default EditRiderProfile;
