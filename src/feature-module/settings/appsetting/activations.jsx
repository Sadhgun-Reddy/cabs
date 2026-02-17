import { useState } from "react";
import SettingsSideBar from "../settingssidebar";


const ActivationSettings = () => {
  const [activation, setActivation] = useState({
    enableCoupon: true,
    referralEnable: true,
    enableRiderWallet: true,
    sosEnable: true,
    allowNegativeBalance: true,
    driverVerification: true,
    fleetVerification: true,
    fleetVehicleVerification: true,
    fullAddressLocation: true,
    onlinePayments: true,
    driverSubscription: true,
    cashPayments: true,
    driverTips: true,
    rideOtpVerify: true,
    parcelOtpVerify: true,
    bidding: true,
    forceUpdate: true,
    airportPriceEnable: true,
    surgePriceEnable: true,
    peakZone: true,
    driver: true,
    additionalMinuteCharge: true,
    additionalDistanceCharge: true,
    additionalWeightCharge: true,
  });

  const handleToggle = (key) => {
    setActivation((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activationList = [
    { key: "enableCoupon", label: "Enable Coupon" },
    { key: "referralEnable", label: "Referral Enable" },
    { key: "enableRiderWallet", label: "Enable Rider Wallet" },
    { key: "sosEnable", label: "SOS Enable" },
    { key: "allowNegativeBalance", label: "Allow Negative Balance" },
    { key: "driverVerification", label: "Driver Verification" },
    { key: "fleetVerification", label: "Fleet Verification" },
    { key: "fleetVehicleVerification", label: "Fleet Vehicle Verification" },
    { key: "fullAddressLocation", label: "Full Address/Location" },
    { key: "onlinePayments", label: "Online Payments" },
    { key: "driverSubscription", label: "Driver Subscription" },
    { key: "cashPayments", label: "Cash Payments" },
    { key: "driverTips", label: "Driver Tips" },
    { key: "rideOtpVerify", label: "Ride OTP Verify" },
    { key: "parcelOtpVerify", label: "Parcel OTP Verify" },
    { key: "bidding", label: "Bidding" },
    { key: "forceUpdate", label: "Force Update" },
    { key: "airportPriceEnable", label: "Airport Price Enable" },
    { key: "surgePriceEnable", label: "Surge Price Enable" },
    { key: "peakZone", label: "Peak Zone" },
    { key: "driver", label: "Driver" },
    { key: "additionalMinuteCharge", label: "Additional Minute Charge" },
    { key: "additionalDistanceCharge", label: "Additional Distance Charge" },
    { key: "additionalWeightCharge", label: "Additional Weight Charge" },
  ];

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
                      <h4>Activation Settings</h4>
                    </div>
                    <div className="card-body ">
                      {/* <ul className="logo-company">
                        <li>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="logo-info me-0 mb-3 mb-md-0">
                                <h6>Invoice Logo</h6>
                                <p>
                                  Upload Logo of your Company to display in
                                  Invoice
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="profile-pic-upload mb-0 me-0">
                                <div className="new-employee-field">
                                  <div className="mb-3 mb-md-0">
                                    <div className="image-upload mb-0">
                                      <input type="file" />
                                      <div className="image-uploads">
                                        <h4>
                                          <i className="feather icon-upload" />
                                          Upload Photo
                                        </h4>
                                      </div>
                                    </div>
                                    <span>
                                      For better preview recommended size is
                                      450px x 450px. Max size 5mb.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="new-logo ms-auto">
                                <Link to="#">
                                  <img src={logoSmallPng} alt="Logo" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <div className="localization-info">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <div className="setting-info">
                              <h6>Invoice Prefix</h6>
                              <p>Add prefix to your invoice</p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="localization-select">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="INV -" />
                              
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <div className="setting-info">
                              <h6>Invoice Due</h6>
                              <p>Select due date to display in Invoice</p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="localization-select d-flex align-items-center fixed-width">
                              <CommonSelect
                                filter={false}
                                options={listofnumbers}
                                value={selectedDue}
                                onChange={(e) => setSelectedDue(e.value)}
                                placeholder="Choose" />
                              
                              <span className="ms-2">Days</span>
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <div className="setting-info">
                              <h6>Invoice Round Off</h6>
                              <p>Value Roundoff in Invoice</p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="localization-select d-flex align-items-center width-custom">
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center me-3">
                                <input
                                  type="checkbox"
                                  id="user3"
                                  className="check"
                                  defaultChecked />
                                
                                <label
                                  htmlFor="user3"
                                  className="checktoggle" />
                                
                              </div>
                              <CommonSelect
                                filter={false}
                                options={roundoff}
                                value={selectedRoundoff}
                                onChange={(e) => setSelectedRoundoff(e.value)}
                                placeholder="Choose" />
                              
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <div className="setting-info">
                              <h6>Show Company Details</h6>
                              <p>Show / Hide Company Details in Invoice</p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="localization-select d-flex align-items-center">
                              <div className="status-toggle modal-status d-flex justify-content-between align-items-center me-3">
                                <input
                                  type="checkbox"
                                  id="user4"
                                  className="check"
                                  defaultChecked />
                                
                                <label
                                  htmlFor="user4"
                                  className="checktoggle" />
                                
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="setting-info">
                              <h6>Invoice Header Terms</h6>
                            </div>
                          </div>
                          <div className="col-sm-8">
                            <div className="mb-3">
                              <textarea
                                rows={4}
                                className="form-control"
                                placeholder="Type your message"
                                defaultValue={""} />
                              
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="setting-info">
                              <h6>Invoice Footer Terms</h6>
                            </div>
                          </div>
                          <div className="col-sm-8">
                            <div className="mb-3">
                              <textarea
                                rows={4}
                                className="form-control"
                                placeholder="Type your message"
                                defaultValue={""} />
                              
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2">
                          
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div> */}

                      {activationList.map((item) => (
                        <div
                          key={item.key}
                          className="d-flex justify-content-between align-items-center py-3 border-bottom"
                        >
                          {/* Left Side Label */}
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold">{item.label}</span>
                            <i className="ti ti-info-circle text-muted"></i>
                          </div>

                          {/* Right Side Toggle */}
                          <div className="col-md-6 text-md-end">
                            <div className="form-check form-switch d-inline-block m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={activation[item.key]}
                                onChange={() => handleToggle(item.key)}
                                // style={{ width: "45px", height: "22px" }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
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

export default ActivationSettings;
