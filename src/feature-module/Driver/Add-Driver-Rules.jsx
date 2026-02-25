import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";

const AddDriverRules = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Vehicle groups dropdown
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [errorGroups, setErrorGroups] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    vehicleGroup: "", // will store the selected group NAME
    priority: "",
  });

  // Fetch vehicle groups on mount
  useEffect(() => {
    const fetchVehicleGroup = async () => {
      setLoadingGroups(true);
      setErrorGroups("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          URLS.GetAllVehicleGroup,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Vehicle groups API response:", res.data);

        // Try to extract the array – adjust based on your actual response
        let categories = [];
        if (Array.isArray(res.data)) {
          categories = res.data;
        } else if (res.data?.vehicleGroups && Array.isArray(res.data.vehicleGroups)) {
          categories = res.data.vehicleGroups;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          categories = res.data.data;
        } else if (res.data?.groups && Array.isArray(res.data.groups)) {
          categories = res.data.groups;
        }

        if (categories.length === 0) {
          console.warn("No vehicle groups found or unexpected response structure");
        }

        setGroups(categories);
      } catch (err) {
        console.error("Failed to fetch vehicle groups:", err);
        setErrorGroups("Could not load vehicle groups");
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchVehicleGroup();
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
      name: formData.title,
      vehicleGroupId: formData.vehicleGroup, // sending name; adjust if backend expects ID
      priority: Number(formData.priority),
      status: status ? "active" : "inactive",
    };

    try {
      await axios.post(URLS.AddDriverRule, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/driverRules");
    } catch (err) {
      console.error("Add error:", err);
      setError(err.response?.data?.message || "Failed to add driver rule");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/driverRules");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Add Driver Rule</h4>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to="/driverRules" className="btn btn-secondary">
                  <i className="feather icon-arrow-left me-2" />
                  Back to Driver Rules
                </Link>
              </div>
            </li>
          </ul>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-6 col-12">
            {error && <div className="alert alert-danger">{error}</div>}
            {errorGroups && <div className="alert alert-warning">{errorGroups}</div>}

            <form onSubmit={handleSubmit}>
              <div className="add-Addzones">
                <div className="card border mb-4">
                  <div className="accordion-body border-top">
                    {/* Title */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter Title"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Group Dropdown */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3 list position-relative">
                          <label className="form-label">Vehicle Group</label>
                          <select
                            name="vehicleGroup"
                            className="form-control"
                            value={formData.vehicleGroup}
                            onChange={handleChange}
                            required
                            disabled={loadingGroups}
                          >
                            <option value="">
                              {loadingGroups
                                ? "Loading vehicle groups..."
                                : "Select Vehicle Group"}
                            </option>
                            {!loadingGroups &&
                              groups.map((group) => (
                                <option key={group._id} value={group._id || group._id || group.title}>
                                  {group.name || group._id || group.title}
                                </option>
                              ))}
                          </select>
                          {loadingGroups && (
                            <div className="mt-2 text-muted">
                              <span className="spinner-border spinner-border-sm me-1" />
                              Loading...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3 list position-relative">
                          <label className="form-label">Priority</label>
                          <input
                            type="number"
                            name="priority"
                            className="form-control"
                            value={formData.priority}
                            onChange={handleChange}
                            placeholder="Enter Priority"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="row">
                      <div className="col-lg-6 col-sm-6 col-12">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="zoneStatus"
                                  checked={status}
                                  onChange={() => setStatus(!status)}
                                />
                                <label
                                  className="form-check-label ms-2"
                                  htmlFor="zoneStatus"
                                >
                                  {status ? "Active" : "Inactive"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="col-lg-12">
                <div className="d-flex align-items-center justify-content-end mb-4">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || loadingGroups}
                  >
                    {loading ? "Adding..." : "Add Rule"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default AddDriverRules;