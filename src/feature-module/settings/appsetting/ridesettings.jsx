import AddPrinter from "../../../core/modals/settings/addprinter";
import EditPrinter from "../../../core/modals/settings/editprinter";
import SettingsSideBar from "../settingssidebar";
import { Link } from "react-router-dom";
import RefreshIcon from "../../../components/tooltip-content/refresh";
import CollapesIcon from "../../../components/tooltip-content/collapes";
import DeleteModal from "../../../components/delete-modal";
import { useState } from "react";

const RideSettings = () => {
    const [formData, setFormData] = useState({
      rideRequsetTime: "",
      rentalAmbulanceRideRequestTime: "",
      increaseAmountRange: "",
      findDriverTime: "",
      rideRequestLeadTime: "",
      driverMaxOnline: "",
      MinIntracityRadius: "",
      maximumBiddingFare: "",
      parcelWeightLimit: "",
      scheduleTimeLimit: "",
      weightUnit: "",
      distanceUnit: "",
      countryCode: "",
      maximumSeat: "",

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
                <div className="card flex-fill mb-0 w-50">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4>Ride</h4>
                    {/* <Link
                      to="#"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add-printer">
                      
                      <i className="ti ti-circle-plus me-1" />
                      Add New Printer
                    </Link> */}
                  </div>
                  {/* <div className="card-body pb-0">
                    <div className="table-responsive">
                      <table className="table border">
                        <thead className="thead-light">
                          <tr>
                            <th>Printer Name</th>
                            <th>Connection type</th>
                            <th>IP Address</th>
                            <th>Port</th>
                            <th className="no-sort" />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>HP Printer</td>
                            <td>Network</td>
                            <td>151.00.1.22</td>
                            <td>$200</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link
                                  className="me-2 p-2"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-printer">
                                  
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  className="p-2"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal">
                                  
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Epson</td>
                            <td>Network</td>
                            <td>151.00.2.20</td>
                            <td>$50</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link
                                  className="me-2 p-2"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit-printer">
                                  
                                  <i className="ti ti-edit" />
                                </Link>
                                <Link
                                  className="p-2"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal">
                                  
                                  <i className="ti ti-trash" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div> */}
                      <div className="card-body pb-0">
                      {/* Min Withdraw Amount */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ride Request Time (Driver)
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="rideRequestTime"
                            className="form-control"
                            value={formData.rideRequsetTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Rental Ambulance Ride Request Time */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Rental Ambulance Ride Request Time{" "}
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                          type="text"
                            name="rentalAmbulanceRideRequestTime"
                            className="form-control"
                            value={formData.rentalAmbulanceRideRequestTime}
                            onChange={handleChange}
                          />

                        </div>
                      </div>

                      {/* Increase Amount Range */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Increase Amount Range{" "}

                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="text"
                              name="increaseAmountRange"
                              className="form-control"
                              value={formData.increaseAmountRange}
                              onChange={handleChange}
                            />
                            {formData.fleetCommissionType === "Percentage" && (
                              <span className="input-group-text">%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Find Driver Time */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Find Driver Time
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="findDriverTime"
                            className="form-control"
                            value={formData.findDriverTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Ride Request Lead Time */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Ride Request Lead Time
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="rideRequestLeadTime"
                            className="form-control"
                            value={formData.rideRequestLeadTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Driver Max Online */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Driver Max Online
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="driverMaxOnline"
                            className="form-control"
                            value={formData.driverMaxOnline}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Min.Intracity Radius */}
                      <div className="row align-items-center mb-4"> 
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Min.Intracity Radius (meter){" "}

                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                          type="text"
                            name="minIntracityRadius"
                            className="form-control"
                            value={formData.minIntracityRadius}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Maximum Bidding Fare */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Maximum Bidding Fare (Driver){" "}

                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="text"
                              name="maximumBiddingFare"
                              className="form-control"
                              value={formData.maximumBiddingFare}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Parcel Weight Limit */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Parcel Weight Limit{" "}
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="text"
                              name="parcelWeightLimit"
                              className="form-control"
                              value={formData.parcelWeightLimit}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Schedule Time Limit */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Schedule Time Limit (hrs){" "}

                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="text"
                              name="scheduleTimeLimit"
                              className="form-control"
                              value={formData.scheduleTimeLimit}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Weight unit */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Weight Unit{" "}
 
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <select
                              type="text"
                              name="weightUnit"
                              className="form-control"
                              value={formData.weightUnit}
                              onChange={handleChange}
                            >
                              <option>Select</option>
                              <option>Kilogram (KG)</option>
                              <option>Pound (IB)</option>
                              </select>
                          </div>
                        </div>
                      </div>

                      {/* Distance unit */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Distance Unit{" "}

                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <select
                              type="text"
                              name="distanceUnit"
                              className="form-control"
                              value={formData.distanceUnit}
                              onChange={handleChange}
                            >
                              <option>Select</option>
                              <option>Kilometers (KM)</option>
                              <option>Miles (MILE)</option>
                              </select>
                          </div>
                        </div>
                      </div>

                      {/* Country Code */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Country Code{" "}
                            <span className="text-danger">*</span>
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <select
                              type="text"
                              name="countryCode"
                              className="form-control"
                              value={formData.countryCode}
                              onChange={handleChange}
                            >
                              <option>Select</option>
                              <option>+1</option>
                              <option>+91</option>
                              <option>+44</option>
                              <option>+41</option>
                              </select>
                          </div>
                        </div>
                      </div>

                      {/* Maximum Seat */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Maximum Seat{" "}
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="input-group">
                            <input
                              type="text"
                              name="maximumSeat"
                              className="form-control"
                              value={formData.maximumSeat}
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
     <DeleteModal />
    </div>);

};

export default RideSettings;