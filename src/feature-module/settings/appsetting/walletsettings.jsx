import { useState } from "react";
import SettingsSideBar from "../settingssidebar";
import RefreshIcon from "../../../components/tooltip-content/refresh";
import CollapesIcon from "../../../components/tooltip-content/collapes";
import CommonFooter from "../../../components/footer/commonFooter";
import CommonSelect from "../../../components/select/common-select";

const WalletSettings = () => {
 
    const [formData, setFormData] = useState({
      walletDenominations: "",
      tipDenominations: "",
      driverMinWalletBalance: "",

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
                <div className="card flex-fill mb-0">
                  <form>
                    <div className="card-header">
                      <h4>Wallet Settings</h4>
                    </div>
                    <div className="card-body">
                      {/* Wallet Denominations */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Wallet Denominations
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="rideRequestTime"
                            className="form-control"
                            value={formData.walletDenominations}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Tip Denominations */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Tip Denominations
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="tipDenominations"
                            className="form-control"
                            value={formData.tipDenominations}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Driver Min Wallet Balance */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Driver Min Wallet Balance
                            <i className="ti ti-info-circle ms-2 text-muted"></i>
                          </label>
                        </div>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="driverMinWalletBalance"
                            className="form-control"
                            value={formData.driverMinWalletBalance}
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
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    </div>);

};

export default WalletSettings;