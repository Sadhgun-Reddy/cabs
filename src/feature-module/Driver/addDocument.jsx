
import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const Adddriverdocument = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    documentImage: null,
    driver: "",
    document: "",
    expiryDate: "",
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
    console.log("Driver Document Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Driver Document</h4>
          </div>
          <Link to={route.driverDocument} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Driver Documents
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">

                {/* DOCUMENT IMAGE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Document Image</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      id="documentImage"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                    <label htmlFor="documentImage" className="upload-label">
                      <i className="feather icon-plus"></i>
                    </label>
                  </div>
                </div>

                {/* DRIVER */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Driver</label>
                  <select
                    name="driver"
                    className="form-select"
                    value={formData.driver}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Driver</option>
                    <option value="1">John</option>
                    <option value="2">Mohan</option>
                  </select>
                </div>

                {/* DOCUMENT */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Document</label>
                  <select
                    name="document"
                    className="form-select"
                    value={formData.document}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Document</option>
                    <option value="license">Driving License</option>
                    <option value="rc">RC</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                {/* EXPIRY DATE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    className="form-control"
                    value={formData.expiryDate}
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
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
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

export default Adddriverdocument;
