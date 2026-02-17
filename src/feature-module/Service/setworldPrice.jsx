import { useState } from "react";
import CommonFooter from "../../components/footer/commonFooter";

const SetWorldPrice = () => {
  const [formData, setFormData] = useState({
    farePlan: "",
    baseFare: "",
    baseDistance: "",
    perDistance: "",
    minimumHrs: "",
    perMinute: "",
    waitingCharge: "",
    freeWaitTime: "",
    freeWaitAfterStart: "",
    cancelRider: "",
    cancelDriver: "",
    commissionType: "fixed",
    commissionRate: "",
    chargeGoesTo: "admin",
    allowTax: true,
    tax: "",
    allowAirport: true,
    airportRate: "",
    allowPreference: true,
    preferenceText: "",
    preferenceRate: "",
    newPreference: "",
    newPreferenceRate: "",
  });

  const [preferences, setPreferences] = useState([
    { id: 1, name: "Pet Allowed", price: "" },
    { id: 2, name: "Extra Luggage Space", price: "" },
    { id: 3, name: "Child Seat", price: "" },
    { id: 4, name: "Smoke-Free", price: "" },
  ]);

  const [newPreference, setNewPreference] = useState("");
  const [newPreferencePrice, setNewPreferencePrice] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updatePreferencePrice = (id, value) => {
    setPreferences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: value } : item)),
    );
  };

  const removePreference = (id) => {
    setPreferences((prev) => prev.filter((item) => item.id !== id));
  };

  const addPreference = () => {
    if (!newPreference || !newPreferencePrice) return;

    setPreferences((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newPreference,
        price: newPreferencePrice,
      },
    ]);

    setNewPreference("");
    setNewPreferencePrice("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-header">
            <h4>Set Fare Plan Price</h4>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-4">
                {/* ================= BASIC PRICING ================= */}

                <div className="col-md-4">
                  <label className="form-label">Fare Plan</label>
                  <div className="input-group">
                    <select
                      type="select"
                      className="form-select"
                      name="farePlan"
                      value={formData.farePlan}
                      onChange={handleChange}
                    >
                      <option>Select Plan</option>
                      <option value="city">City Ride</option>
                      <option value="outstation">Outstation Oneway </option>
                      <option value="round">Round Trip</option>
                      <option value="rental">Rental Hourly Package</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Base Fare Charge *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="baseFare"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Base Distance (Km) *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="baseDistance"
                    onChange={handleChange}
                  />
                </div>

                {/* Show only for Rental Hourly Package */}
                {formData.farePlan === "rental" && (
                  <div className="col-md-4">
                    <label className="form-label">Minimum Hours *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimumHrs"
                      value={formData.minimumHrs}
                      onChange={handleChange}
                      placeholder="Enter Minimum Hours"
                    />
                  </div>
                )}

                <div className="col-md-4">
                  <label className="form-label">
                    Per Distance Charge (Km) *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="perDistance"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Per Minute Charge *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="perMinute"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Waiting Charge</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="waitingCharge"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Free Wait Time</label>
                  <input
                    type="number"
                    className="form-control"
                    name="freeWaitTime"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Free Wait Time After Start Ride
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="freeWaitAfterStart"
                    onChange={handleChange}
                  />
                </div>

                {/* ================= CANCELLATION ================= */}
                <div className="col-md-4">
                  <label className="form-label">
                    Cancellation Charge for Rider
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="cancelRider"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Cancellation Charge for Driver
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="cancelDriver"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ================= COMMISSION ================= */}
                <div className="col-md-4">
                  <label className="form-label">Commission Type *</label>
                  <select
                    className="form-select"
                    name="commissionType"
                    onChange={handleChange}
                  >
                    <option value="select">Select</option>
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Commission Rate *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="commissionRate"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Charge Goes To</label>
                  <select
                    className="form-select"
                    name="chargeGoesTo"
                    onChange={handleChange}
                  >
                    <option value="select">Select</option>
                    <option value="admin">Admin</option>
                    <option value="driver">Driver</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {/* ================= TOGGLES ================= */}
                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="allowTax"
                      checked={formData.allowTax}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Allow Tax</label>
                  </div>
                </div>

                {formData.allowTax && (
                  <div className="col-md-4">
                    <label className="form-label">Tax</label>
                    <select
                      className="form-select"
                      name="tax"
                      value={formData.tax}
                      onChange={handleChange}
                    >
                      <option value="">Select Tax</option>
                      <option value="gst">GST</option>
                      <option value="vat">VAT</option>
                      <option value="service">Service Tax</option>
                    </select>
                  </div>
                )}

                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="allowAirport"
                      checked={formData.allowAirport}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Allow Airport Charge
                    </label>
                  </div>
                </div>

                {formData.allowAirport && (
                  <div className="col-md-4">
                    <label className="form-label">Airport Charge Rate</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        name="airportRate"
                        value={formData.airportRate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="allowPreference"
                      checked={formData.allowPreference}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Allow Preference</label>
                  </div>
                </div>

                {/* ================= PREFERENCE (EXACT ORDER) ================= */}
                {formData.allowPreference &&
                  preferences.map((item) => (
                    <div className="row g-3 align-items-end" key={item.id}>
                      <div className="col-md-4">
                        <label className="form-label">Preference</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.name}
                          disabled
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Preference Price</label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={item.price}
                            onChange={(e) =>
                              updatePreferencePrice(item.id, e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          onClick={() => removePreference(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                <div className="col-md-4">
                  <label className="form-label">Select Preference</label>
                  <select
                    className="form-select"
                    name="newPreference"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="pet">Pet Allowed</option>
                    <option value="ac">AC</option>
                    <option value="luggage">Extra Luggage</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Preference Rate</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="newPreferenceRate"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-success w-100"
                  >
                    Add Preference
                  </button>
                </div>
              </div>
            </div>

            {/* ================= FOOTER BUTTONS ================= */}
            <div className="card-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Prices
              </button>
            </div>
          </form>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default SetWorldPrice;
