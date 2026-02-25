import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";

const AddDriverRules = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    vehhicleGroup: "",
    priority: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

        <div className="row justify-content-center">
          {/* LEFT COLUMN – FORM */}
          <div className="col-lg-6 col-md-6 col-12">
            <form onSubmit={handleSubmit}>
              <div className="add-Addzones">
                <div className="card border mb-4">
                  {/* <h2 className="card-header" id="headingSpacingOne">
                    <div className="d-flex align-items-center justify-content-between flex-fill">
                      <h5 className="d-flex align-items-center">
                        <i className="feather icon-info text-primary me-2" />
                        <span>Add Driver Rules Information</span>
                      </h5>
                    </div>
                  </h2> */}

                  <div className="accordion-body border-top">
                    {/* Zone Name */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3">
                          <label className="form-label">Titile</label>
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

                    {/* Priority */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3 list position-relative">
                          <label className="form-label">Vehicle Group</label>
                          <input
                            type="text"
                            name="vehicleGroup"
                            className="form-control"
                            value={formData.vehicleGroup}
                            onChange={handleChange}
                            placeholder="Enter Vehicle Group"
                            required
                          />
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
                    disabled={loading}
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
