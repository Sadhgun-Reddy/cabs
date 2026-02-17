import { Link } from "react-router-dom";
import EditCustomFields from "../../../core/modals/settings/editcustomfields";
import SettingsSideBar from "../settingssidebar";
import CollapesIcon from "../../../components/tooltip-content/collapes";
import AddCustomFields from "../../../core/modals/settings/addcustomfields";
import RefreshIcon from "../../../components/tooltip-content/refresh";
import DeleteModal from "../../../components/delete-modal";
import { useState } from "react";

const LocationSettings = () => {
  const [formData, setFormData] = useState({
    googleMapApiKey: "",
    typeOfMap: "",
    radiusMeter: "",
    radiusPerSeconds: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content settings-content">
          <div className="page-header settings-pg-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Settings</h4>
                <h6>Manage your settings on portal</h6>
              </div>
            </div>
            {/* <ul className="table-top-head">
              <RefreshIcon />
              <CollapesIcon />
            </ul> */}
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="settings-wrapper d-flex">
                <SettingsSideBar />
                <div className="card flex-fill mb-0 w-50">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4>Location Settings</h4>
                    {/* <div className="page-btn">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add-custom-field">
                        
                        <i className="ti ti-circle-plus me-1" />
                        Add New Field
                      </Link>
                    </div> */}
                  </div>

                  <div className="card-body">
                    {/* Google Map API Key */}
                    <div className="row align-items-center mb-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Google Map API Key
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          type="text"
                          name="googleMapApiKey"
                          className="form-control"
                          value={formData.googleMapApiKey}
                          onChange={handleChange}
                        />
                        <p className="text-muted">
                          * Need help generating a Google Maps API key? Follow
                          the steps in the<span className="text-green"> Google Maps API Documentation. </span>After
                          entering your API key above, click "Test Map" to
                          preview it in a modal and verify it's working
                          correctly.
                        </p>
                      </div>
                    </div>

                    {/* Type of Map */}
                    <div className="row align-items-center mb-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Type of Map
                          <i className="ti ti-info-circle ms-2 text-muted"></i>
                        </label>
                      </div>
                      <div className="col-md-8">
                        <select
                          type="text"
                          name="typeOfMap"
                          className="form-select"
                          value={formData.typeOfMap}
                          onChange={handleChange}
                        >
                          <option>Select Map</option>
                          <option>Google Map</option>
                          <option>Open Street Map</option>
                          </select>
                      </div>
                    </div>

                    {/* Radius Meter */}
                    <div className="row align-items-center mb-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Radius Meter
                          <i className="ti ti-info-circle ms-2 text-muted"></i>
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          type="text"
                          name="radiusMeter"
                          className="form-control"
                          value={formData.radiusMeter}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Radius Per Seconds */}
                    <div className="row align-items-center mb-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Radius Per Seconds
                          <i className="ti ti-info-circle ms-2 text-muted"></i>
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          type="text"
                          name="radiusPerSeconds"
                          className="form-control"
                          value={formData.radiusPerSeconds}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end">
                      <button
                        type="button"
                        className="btn btn-success"
                        data-bs-dismiss="modal"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014-2026 © Gk Cabs. All Right Reserved</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LocationSettings;
