import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { URLS } from "../../url";
import { all_routes } from "../../routes/all_routes";

const EditFarePlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const route = all_routes;

  // Get the plan data passed from FarePlans
  const passedPlan = location.state?.plan;

  // If no plan was passed, redirect back to the list
  useEffect(() => {
    if (!passedPlan) {
      navigate(route.fareplans);
    }
  }, [passedPlan, navigate, route.fareplans]);

  const [serviceCategories, setServiceCategories] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorServices, setErrorServices] = useState("");

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    serviceCategoryId: "",
    planName: "",
    priority: "",
  });

  // 1. Fetch service categories (same as AddFarePlan)
  useEffect(() => {
    const fetchServiceCategories = async () => {
      setLoadingServices(true);
      setErrorServices("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          URLS.GetServiceCategoryById,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const categories = res.data?.serviceTypes || [];
        setServiceCategories(categories);
      } catch (err) {
        console.error("Failed to fetch service categories:", err);
        setErrorServices("Could not load service categories");
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServiceCategories();
  }, []);

  // 2. Populate form with passed plan data
  useEffect(() => {
    if (passedPlan) {
      setFormData({
        serviceCategoryId: passedPlan.serviceCategoryId || "",
        planName: passedPlan.planName || "",
        priority: passedPlan.priority || "",
      });
      setStatus(passedPlan.status === "active");
    }
  }, [passedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      serviceCategoryId: formData.serviceCategoryId,
      planName: formData.planName,
      priority: formData.priority,
      status: status ? "active" : "inactive",
    };

    try {
      await axios.put(`${URLS.EditFarePlan}/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(route.fareplans);
    } catch (err) {
      console.error("Update error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update fare plan";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Edit Fare Plan</h4>
          </div>
          <Link to="/fareplans" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Fare Plan
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {errorServices && (
          <div className="alert alert-warning">{errorServices}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card border mb-4">
            <div className="card-body">
              {/* Service Name Dropdown */}
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <select
                  name="serviceCategoryId"
                  className="form-select"
                  value={formData.serviceCategoryId}
                  onChange={handleChange}
                  required
                  disabled={loadingServices}
                >
                  <option value="">
                    {loadingServices ? "Loading services..." : "Select Service"}
                  </option>
                  {!loadingServices &&
                    serviceCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} {/* Keep same as AddFarePlan (shows ID) */}
                      </option>
                    ))}
                </select>
                {loadingServices && (
                  <div className="mt-2 text-muted">
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </div>
                )}
              </div>

              {/* Fare Plan Name */}
              <div className="mb-3">
                <label className="form-label">Fare Plan Name</label>
                <input
                  type="text"
                  name="planName"
                  className="form-control"
                  value={formData.planName}
                  onChange={handleChange}
                  placeholder="Enter Plan Name"
                  required
                />
              </div>

              {/* Priority */}
              <div className="mb-3">
                <label className="form-label">Priority</label>
                <input
                  type="text"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                  placeholder="Enter Priority"
                  required
                />
              </div>

              {/* Status */}
              <div className="mb-3">
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

              {/* Submit Button */}
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading || loadingServices}
                >
                  {loading ? "Updating..." : "Update Plan"}
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