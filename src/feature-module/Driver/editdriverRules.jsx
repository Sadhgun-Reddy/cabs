import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";
import { all_routes } from "../../routes/all_routes";

const EditDriverRules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const route = all_routes;

  const passedRule = location.state?.driverRule;

  useEffect(() => {
    if (!passedRule) {
      navigate(route.driverRules);
    }
  }, [passedRule, navigate, route.driverRules]);

    // Vehicle groups dropdown
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [errorGroups, setErrorGroups] = useState("");

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    vehicleGroupId: "",
    priority: "",
  });

  // Fetch vehicle groups on mount (same as Add)
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
          },
        );
        const categories = res.data?.vehicleGroup || [];
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

  // Populate form with passed rule data
  useEffect(() => {
    if (passedRule) {
      setFormData({
        name: passedRule.name || "",
        vehicleGroupId: passedRule.vehicleGroupId || "",
        priority: passedRule.priority || "",
      });
      setStatus(passedRule.status === "active");
    }
  }, [passedRule]);

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
      vehicleGroupId: formData.vehicleGroupId,
      priority: formData.priority,
      status: status ? "active" : "inactive",
    };

    try {
      await axios.put(`${URLS.EditDriverRule}/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate(route.driverRules);
    } catch (err) {
      console.error("Edit error:", err);
      setError(err.response?.data?.message || "Failed to update driver rule");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(route.driverRules);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Edit Driver Rule</h4>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.driverRules} className="btn btn-secondary">
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
            {errorGroups && (
              <div className="alert alert-warning">{errorGroups}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="add-Addzones">
                <div className="card border mb-4">
                  <div className="accordion-body border-top">
                    {/* Name (Title) */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Title"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Group Dropdown */}
                    {/* <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3 list position-relative">
                          <label className="form-label">Vehicle Group</label>
                          <select
                            name="vehicleGroupId"
                            className="form-control"
                            value={formData.vehicleGroupId}
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
                                <option key={group._id} value={group._id}>
                                  {group.name || group.title || group._id}
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
                    </div> */}

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
                                  id="ruleStatus"
                                  checked={status}
                                  onChange={() => setStatus(!status)}
                                />
                                <label
                                  className="form-check-label ms-2"
                                  htmlFor="ruleStatus"
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
                    {loading ? "Updating..." : "Update and Exit"}
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

export default EditDriverRules;
