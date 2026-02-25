import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import { URLS } from "../../url";

const AddVehicleModel = () => {
  const route = all_routes;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    seater: "",
    priority: "",
    status: "",
    vehicleGroupId: "",
  });

  const [vehicleGroups, setVehicleGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGroups, setFetchingGroups] = useState(false);
  const [error, setError] = useState("");

  // Fetch vehicle groups for dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      setFetchingGroups(true);
      try {
        const res = await axios.post(
          URLS.GetAllVehicleGroup,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const groups = res.data?.groups || res.data?.data || [];
        setVehicleGroups(groups);
      } catch (err) {
        console.error("Failed to fetch vehicle groups", err);
        setError("Could not load vehicle groups");
      } finally {
        setFetchingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      seater: formData.seater,
      priority: formData.priority,
      vehicleGroupId: formData.vehicleGroupId,
      status: "active", // default status
    };

    try {
      await axios.post(URLS.AddVehicleModel, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(route.vehiclemodel); // adjust to your actual list route
    } catch (err) {
      console.error("Add vehicle model error:", err);
      setError(err.response?.data?.message || "Failed to add vehicle model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h4>Add Vehicle Model</h4>
          </div>
          <Link to={route.vehiclemodel} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle Model
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* Group Name Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Group Name</label>
                  <select
                    name="vehicleGroupId"
                    className="form-select"
                    value={formData.vehicleGroupId}
                    onChange={handleChange}
                    required
                    disabled={fetchingGroups}
                  >
                    <option value="">Select Group</option>
                    {vehicleGroups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {fetchingGroups && (
                    <small className="text-muted">Loading groups...</small>
                  )}
                </div>

                {/* Model Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Model Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter Model"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                {/* Seater */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Seater</label>
                  <input
                    type="text"
                    name="seater"
                    className="form-control"
                    placeholder="Enter Seater"
                    value={formData.seater}
                    onChange={handleChange}
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

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="statusSwitch"
                      checked={formData.status === "active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked ? "active" : "inactive",
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="statusSwitch">
                      {formData.status === "active" ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button
                  type="submit"
                  className="btn btn-outline-success"
                  disabled={loading || fetchingGroups}
                >
                  {loading ? "Adding..." : "Add Vehicle Model"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModel;
