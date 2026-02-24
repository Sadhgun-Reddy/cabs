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

  // Try to get plan data from navigation state (passed from FarePlans list)
  const passedPlan = location.state?.plan;

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!passedPlan);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    serviceName: passedPlan?.name || "",
    planName: passedPlan?.planname || "",
    priority: passedPlan?.priority || "",
  });

  // If we have passed data, set status from it
  useEffect(() => {
    if (passedPlan) {
      setStatus(passedPlan.Status === "Active");
    }
  }, [passedPlan]);

  // Fallback: fetch all plans and find the one with matching ID
  const fetchAllPlansAndFind = async () => {
    setFetchLoading(true);
    setError("");
    try {
      // Use your existing endpoint that returns all fare plans
      const res = await axios.post(
        URLS.GetAllFairPlans,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const fairPlans = res.data?.fairPlans || res.data?.data || [];
      const plan = fairPlans.find((p) => p._id === id);

      if (!plan) {
        throw new Error("Fare plan not found");
      }

      setFormData({
        serviceName: plan.serviceName || "",
        planName: plan.planName || "",
        priority: plan.priority || "",
      });
      setStatus(plan.status === "active");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load fare plan data");
    } finally {
      setFetchLoading(false);
    }
  };

  // If no passed state, fetch all plans as fallback
  useEffect(() => {
    if (!passedPlan) {
      fetchAllPlansAndFind();
    }
  }, [id, passedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      serviceName: formData.serviceName,
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
      console.error("Full error object:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update fare plan";
      setError(msg);
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
            <h4>Edit Fare Plan</h4>
          </div>
          <Link to="/fareplans" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Fare Plan
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card border mb-4">
            <div className="card-body">
              {/* Service Name */}
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <select
                  name="serviceName"
                  className="form-select"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service</option>
                  <option value="City Ride">City Ride</option>
                  <option value="Outstation Oneway">Outstation Oneway</option>
                  <option value="Outstation Round Trip">
                    Outstation Round Trip
                  </option>
                  <option value="Rental Hourly Package">
                    Rental Hourly Package
                  </option>
                </select>
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
                  disabled={loading}
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
