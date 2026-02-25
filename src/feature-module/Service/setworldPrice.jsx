import { useState, useEffect } from "react";
import axios from "axios";
import { URLS } from "../../url";
import CommonFooter from "../../components/footer/commonFooter";

const SetWorldPrice = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errors, setErrors] = useState({});
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

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.post(
        URLS.GetAllServiceCategories,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.serviceTypes) {
        setCategories(response.data.serviceTypes);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farePlan) newErrors.farePlan = "Category is required";

    if (!formData.baseFare || isNaN(formData.baseFare) || Number(formData.baseFare) <= 0) {
      newErrors.baseFare = "Valid Base Fare is required";
    }

    if (!formData.baseDistance || isNaN(formData.baseDistance) || Number(formData.baseDistance) <= 0) {
      newErrors.baseDistance = "Valid Base Distance is required";
    }

    if (formData.farePlan === "rental" && (!formData.minimumHrs || isNaN(formData.minimumHrs) || Number(formData.minimumHrs) <= 0)) {
      newErrors.minimumHrs = "Valid Minimum Hours is required for rental";
    }

    if (!formData.perDistance || isNaN(formData.perDistance) || Number(formData.perDistance) < 0) {
      newErrors.perDistance = "Valid Per Distance Charge is required";
    }

    if (!formData.perMinute || isNaN(formData.perMinute) || Number(formData.perMinute) < 0) {
      newErrors.perMinute = "Valid Per Minute Charge is required";
    }

    if (!formData.commissionType || formData.commissionType === "select") {
      newErrors.commissionType = "Commission Type is required";
    }

    if (!formData.commissionRate || isNaN(formData.commissionRate) || Number(formData.commissionRate) < 0) {
      newErrors.commissionRate = "Valid Commission Rate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitted Data:", formData);
      // Proceed with API submission here...
    }
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
                  <label className="form-label">Categories *</label>
                  <div className="input-group">
                    <select
                      type="select"
                      className={`form-select ${errors.farePlan ? "is-invalid" : ""}`}
                      name="farePlan"
                      value={formData.farePlan}
                      onChange={handleChange}
                    >
                      <option value="">Select Plan</option>
                      {loadingCategories ? (
                        <option value="" disabled>Loading...</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.farePlan && <div className="invalid-feedback">{errors.farePlan}</div>}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Base Fare Charge *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className={`form-control ${errors.baseFare ? "is-invalid" : ""}`}
                      name="baseFare"
                      value={formData.baseFare}
                      onChange={handleChange}
                    />
                    {errors.baseFare && <div className="invalid-feedback">{errors.baseFare}</div>}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Base Distance (Km) *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.baseDistance ? "is-invalid" : ""}`}
                    name="baseDistance"
                    value={formData.baseDistance}
                    onChange={handleChange}
                  />
                  {errors.baseDistance && <div className="invalid-feedback d-block">{errors.baseDistance}</div>}
                </div>

                {/* Show only for Rental Hourly Package, assuming you map the ID or name for rental. 
                    For now, showing always if rental was selected, but since IDs are dynamic, you might need to check name instead if you have a specific rental category */}
                <div className="col-md-4">
                  <label className="form-label">Minimum Hours (For Rental)</label>
                  <input
                    type="number"
                    className={`form-control ${errors.minimumHrs ? "is-invalid" : ""}`}
                    name="minimumHrs"
                    value={formData.minimumHrs}
                    onChange={handleChange}
                    placeholder="Enter Minimum Hours"
                  />
                  {errors.minimumHrs && <div className="invalid-feedback d-block">{errors.minimumHrs}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Per Distance Charge (Km) *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className={`form-control ${errors.perDistance ? "is-invalid" : ""}`}
                      name="perDistance"
                      value={formData.perDistance}
                      onChange={handleChange}
                    />
                    {errors.perDistance && <div className="invalid-feedback">{errors.perDistance}</div>}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Per Minute Charge *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className={`form-control ${errors.perMinute ? "is-invalid" : ""}`}
                      name="perMinute"
                      value={formData.perMinute}
                      onChange={handleChange}
                    />
                    {errors.perMinute && <div className="invalid-feedback">{errors.perMinute}</div>}
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
                    className={`form-select ${errors.commissionType ? "is-invalid" : ""}`}
                    name="commissionType"
                    value={formData.commissionType}
                    onChange={handleChange}
                  >
                    <option value="select">Select</option>
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage</option>
                  </select>
                  {errors.commissionType && <div className="invalid-feedback d-block">{errors.commissionType}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Commission Rate *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      {formData.commissionType === "percentage" ? "%" : "₹"}
                    </span>
                    <input
                      type="number"
                      className={`form-control ${errors.commissionRate ? "is-invalid" : ""}`}
                      name="commissionRate"
                      value={formData.commissionRate}
                      onChange={handleChange}
                    />
                    {errors.commissionRate && <div className="invalid-feedback">{errors.commissionRate}</div>}
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