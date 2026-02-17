import { Link } from "react-router-dom";
import SettingsSideBar from "../settingssidebar";
import RefreshIcon from "../../../components/tooltip-content/refresh";
import CollapesIcon from "../../../components/tooltip-content/collapes";
import { useState } from "react";

const Commission = () => {
  const [formData, setFormData] = useState({
    minWithdraw: "",
    fleetCommissionType: "",
    fleetCommissionRate: "",
    ambulanceBaseFare: "",
    ambulancePerKm: "",
    ambulancePerMinute: "",
    ambulanceCommissionType: "",
    ambulanceCommissionRate: "",
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content settings-content">
          <div className="page-header settings-pg-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Settings</h4>
                <h6>Manage your settings on portal</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <RefreshIcon />
              <CollapesIcon />
            </ul>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="settings-wrapper d-flex">
                <SettingsSideBar />
                <div className="card flex-fill mb-0">
                  <form>
                    <div className="card-header">
                      <h4>Commission</h4>
                    </div>

                    <div className="card-body pb-0">
                      {/* Min Withdraw Amount */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Min Withdraw Amount
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="number"
                            name="minWithdraw"
                            className="form-control"
                            value={formData.minWithdraw}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Fleet Commission Type */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Fleet Commission Type{" "}
                            <span className="text-danger">*</span>
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <select
                            name="fleetCommissionType"
                            className="form-select"
                            value={formData.fleetCommissionType}
                            onChange={handleChange}
                          >
                            <option>Select</option>
                            <option>Percentage</option>
                            <option>Fixed</option>
                          </select>
                        </div>
                      </div>

                      {/* Fleet Commission Rate */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Fleet Commission Rate{" "}
                            <span className="text-danger">*</span>
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="number"
                              name="fleetCommissionRate"
                              className="form-control"
                              value={formData.fleetCommissionRate}
                              onChange={handleChange}
                            />
                            {formData.fleetCommissionType === "Percentage" && (
                              <span className="input-group-text">%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ambulance Base Fare */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ambulance Base Fare
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="number"
                            name="ambulanceBaseFare"
                            className="form-control"
                            value={formData.ambulanceBaseFare}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Ambulance Per Km Charge */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ambulance Per Km Charge
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="number"
                            name="ambulancePerKm"
                            className="form-control"
                            value={formData.ambulancePerKm}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Ambulance Per Minute Charge */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ambulance Per Minute Charge
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="number"
                            name="ambulancePerMinute"
                            className="form-control"
                            value={formData.ambulancePerMinute}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Ambulance Commission Type */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ambulance Commission Type{" "}
                            <span className="text-danger">*</span>
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <select
                            name="ambulanceCommissionType"
                            className="form-select"
                            value={formData.ambulanceCommissionType}
                            onChange={handleChange}
                          >
                            <option>Select</option>
                            <option>Percentage</option>
                            <option>Fixed</option>
                          </select>
                        </div>
                      </div>

                      {/* Ambulance Commission Rate */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ambulance Commission Rate{" "}
                            <span className="text-danger">*</span>
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="number"
                              name="ambulanceCommissionRate"
                              className="form-control"
                              value={formData.ambulanceCommissionRate}
                              onChange={handleChange}
                            />
                            {formData.ambulanceCommissionType ===
                              "Percentage" && (
                              <span className="input-group-text">%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Status
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="status"
                              checked={formData.status}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="text-end pt-3 border-top mb-4">
                        <button className="btn btn-success px-4">
                          <i className="ti ti-device-floppy me-1"></i>
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commission;
