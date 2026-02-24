import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import { URLS } from "../../url";

const EditVehicleGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = all_routes;

  const [status, setStatus] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [existingMainImageUrl, setExistingMainImageUrl] = useState("");
  const [existingGoogleImageUrl, setExistingGoogleImageUrl] = useState("");

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

  // Helper to construct full image URL
  const getFullImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    
    const baseURL = URLS.baseURL || "http://88.222.213.67:5090"; 
    return `${baseURL}/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    if (!id) return;
    fetchVehicleGroupById();
  }, [id]);

  const fetchVehicleGroupById = async () => {
    setFetchLoading(true);
    setError("");
    try {
      const res = await axios.post(
        URLS.GetVehicleGroupById,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const vehicleGroup = res.data.group || res.data;

      setFormData({
        name: vehicleGroup.name || "",
        description: vehicleGroup.description || "",
        priority: vehicleGroup.priority || "",
        downGrade: vehicleGroup.downGrade || "",
      });

      setStatus(vehicleGroup.status === "active");

      // Handle main image
      if (vehicleGroup.mainImage) {
        const fullUrl = getFullImageUrl(vehicleGroup.mainImage);
        setExistingMainImageUrl(fullUrl);
        setMainImagePreview(fullUrl);
        console.log("Main image URL:", fullUrl); 
      } else {
        setExistingMainImageUrl("");
        setMainImagePreview("");
      }

      // Handle google image
      if (vehicleGroup.googleImage) {
        const fullUrl = getFullImageUrl(vehicleGroup.googleImage);
        setExistingGoogleImageUrl(fullUrl);
        setGoogleImagePreview(fullUrl);
        console.log("Google image URL:", fullUrl);
      } else {
        setExistingGoogleImageUrl("");
        setGoogleImagePreview("");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load vehicle group data. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (mainImagePreview && !mainImagePreview.startsWith("http")) {
      URL.revokeObjectURL(mainImagePreview);
    }

    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGoogleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (googleImagePreview && !googleImagePreview.startsWith("http")) {
      URL.revokeObjectURL(googleImagePreview);
    }

    setGoogleImageFile(file);
    setGoogleImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveMainImage = () => {
    if (mainImagePreview && !mainImagePreview.startsWith("http")) {
      URL.revokeObjectURL(mainImagePreview);
    }
    if (existingMainImageUrl) {
      setMainImageFile(null);
      setMainImagePreview(existingMainImageUrl);
    } else {
      setMainImageFile(null);
      setMainImagePreview("");
    }
  };

  const handleRemoveGoogleImage = () => {
    if (googleImagePreview && !googleImagePreview.startsWith("http")) {
      URL.revokeObjectURL(googleImagePreview);
    }
    if (existingGoogleImageUrl) {
      setGoogleImageFile(null);
      setGoogleImagePreview(existingGoogleImageUrl);
    } else {
      setGoogleImageFile(null);
      setGoogleImagePreview("");
    }
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
      await axios.put(`${URLS.EditVehicleGroup}/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(route.vehiclegroups);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Failed to update vehicle group. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview && !mainImagePreview.startsWith("http")) {
        URL.revokeObjectURL(mainImagePreview);
      }
      if (googleImagePreview && !googleImagePreview.startsWith("http")) {
        URL.revokeObjectURL(googleImagePreview);
      }
    };
  }, [mainImagePreview, googleImagePreview]);

  if (fetchLoading) {
    return (
      <div className="page-wrapper">
        <div className="content text-center py-5">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Edit Vehicle Group</h4>
          </div>
          <Link to={route.vehiclegroups} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle Group
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

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
                        onError={(e) => {
                          e.target.style.display = "none"; 
                          console.error("Failed to load image:", mainImagePreview);
                        }}
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
                        onError={(e) => {
                          e.target.style.display = "none";
                          console.error("Failed to load image:", googleImagePreview);
                        }}
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
                  {loading ? "Updating..." : "Update Vehicle Group"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleGroup;