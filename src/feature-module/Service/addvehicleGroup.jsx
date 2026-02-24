import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import { URLS } from "../../url";

const AddVehicleGroup = () => {
  const navigate = useNavigate();
  const route = all_routes;

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Separate states for main image and google image (single file each)
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [googleImageFile, setGoogleImageFile] = useState(null);
  const [googleImagePreview, setGoogleImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    downGrade: "",
  });

  // Handle main image selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);

    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  // Handle google image selection
  const handleGoogleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (googleImagePreview) URL.revokeObjectURL(googleImagePreview);

    setGoogleImageFile(file);
    setGoogleImagePreview(URL.createObjectURL(file));
  };

  // Remove main image
  const handleRemoveMainImage = () => {
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    setMainImageFile(null);
    setMainImagePreview("");
  };

  // Remove google image
  const handleRemoveGoogleImage = () => {
    if (googleImagePreview) URL.revokeObjectURL(googleImagePreview);
    setGoogleImageFile(null);
    setGoogleImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("downGrade", formData.downGrade);
    formDataToSend.append("status", status ? "active" : "inactive");

    if (mainImageFile) {
      formDataToSend.append("mainImage", mainImageFile);
    }
    if (googleImageFile) {
      formDataToSend.append("googleImage", googleImageFile);
    }

    try {
      const response = await axios.post(URLS.AddVehicleGroup, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate(route.vehiclegroups);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to add vehicle group";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      if (googleImagePreview) URL.revokeObjectURL(googleImagePreview);
    };
  }, [mainImagePreview, googleImagePreview]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Add Vehicle Group</h4>
          </div>
          <Link to="/Vehicle-Group" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle Group
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              {/* Two separate image upload areas */}
              <div className="row">
                {/* Main Image */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleMainImageChange}
                  />
                  <small className="text-muted">Supported: JPG, PNG, GIF</small>
                  {mainImagePreview && (
                    <div className="mt-2 position-relative d-inline-block">
                      <img
                        src={mainImagePreview}
                        alt="Main preview"
                        style={{
                          height: "100px",
                          width: "100px",
                          objectFit: "cover",
                        }}
                        className="border rounded"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={handleRemoveMainImage}
                        style={{
                          borderRadius: "50%",
                          width: "25px",
                          height: "25px",
                          padding: 0,
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                {/* Google Image */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Google Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleGoogleImageChange}
                  />
                  <small className="text-muted">Supported: JPG, PNG, GIF</small>
                  {googleImagePreview && (
                    <div className="mt-2 position-relative d-inline-block">
                      <img
                        src={googleImagePreview}
                        alt="Google preview"
                        style={{
                          height: "100px",
                          width: "100px",
                          objectFit: "cover",
                        }}
                        className="border rounded"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={handleRemoveGoogleImage}
                        style={{
                          borderRadius: "50%",
                          width: "25px",
                          height: "25px",
                          padding: 0,
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Group Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Group Name"
                    required
                  />
                </div>

                {/* Priority */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Priority</label>
                  <input
                    type="number"
                    name="priority"
                    className="form-control"
                    placeholder="Enter Priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                {/* Description */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    required
                  />
                </div>

                {/* Down Grade */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Down Grade</label>
                  <input
                    className="form-control"
                    type="number"
                    name="downGrade"
                    value={formData.downGrade}
                    onChange={handleChange}
                    placeholder="Enter Grade"
                  />
                </div>
              </div>

              <div className="row">
                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="statusSwitch"
                      checked={status}
                      onChange={() => setStatus(!status)}
                    />
                    <label className="form-check-label" htmlFor="statusSwitch">
                      {status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button
                  type="submit"
                  className="btn btn-outline-success"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Vehicle Group"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleGroup;
