import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import { URLS } from "../../url";

const EditServiceCategory = () => {
  const route = all_routes;
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    priority: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch existing data on mount
  useEffect(() => {
    const fetchServiceType = async () => {
      setFetchLoading(true);
      setError("");
      try {
        const response = await axios.post(
          URLS.GetAllServiceCategories,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const serviceTypes = response.data?.serviceTypes || [];
        const current = serviceTypes.find((item) => item._id === id);

        if (current) {
          setFormData({
            name: current.name || "",
            priority: current.priority || "",
            status: current.status === "active",
          });
        } else {
          setError("Service category not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load service category");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchServiceType();
    } else {
      setFetchLoading(false);
      setError("No service category ID provided");
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Build payload based on API expectations
      const payload = {
        name: formData.name,
        priority: formData.priority,
        status: formData.status ? "active" : "inactive",
      };

      await axios.put(`${URLS.EditServiceCategory}/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Success – navigate back to list
      navigate(route.serviceCategorie);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update service category");
    } finally {
      setLoading(false);
    }
  };

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
            <h4>Edit Service Category</h4>
          </div>
          <Link to={route.serviceCategorie} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Service Category
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
              <div className="row">
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

                {/* PRIORITY */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Priority</label>
                  <input
                    type="text"
                    className="form-control"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Status */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <div className="form-check form-switch d-flex align-items-center gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="statusSwitch"
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.checked,
                        }))
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
                <button
                  type="submit"
                  className="btn btn-outline-success"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update and Exit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceCategory;
