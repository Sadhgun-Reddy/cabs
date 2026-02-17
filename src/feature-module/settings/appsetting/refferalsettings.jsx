import CommonFooter from "../../../components/footer/commonFooter";
import SettingsSideBar from "../settingssidebar";
import { useState } from "react";

const RefferalSettings = () => {

    const [formData, setFormData] = useState({
      minimumRideAmount: "",
      refferalBonusPercentage: "",
      refferedUserBonusPercentage: "",

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
                    <h4>Refferal Settings</h4>
                  </div>
                  <div className="card-body">

                      {/* Minimum Ride Amount */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Minimum Ride Amount
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="minimumRideAmount"
                            className="form-control"
                            value={formData.minimumRideAmount}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Refferal Bonus Percentage */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Refferal Bonus Percentage
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="refferalBonusPercentage"
                            className="form-control"
                            value={formData.refferalBonusPercentage}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Reffered User Bonus Percentage */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Reffered User Bonus Percentage
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="refferedUserBonusPercentage"
                            className="form-control"
                            value={formData.refferedUserBonusPercentage}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-end">
                        <button
                          type="button"
                          className="btn btn-success"
                          data-bs-dismiss="modal">
                          
                          Save
                        </button>
                      </div>
                 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>

    </div>);

};

export default RefferalSettings;