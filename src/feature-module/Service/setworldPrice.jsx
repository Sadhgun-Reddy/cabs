import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { URLS } from "../../url";
import CommonFooter from "../../components/footer/commonFooter";

const SetWorldPrice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cityfair = location.state?.cityfair || {};
  const zoneId = location.state?.zoneId;
  const vehicleGroupId = location.state?.vehicleGroupId;

  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [driverRules, setDriverRules] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingTaxes, setLoadingTaxes] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    farePlan: cityfair.serviceCategoryId || "",
    baseFare: cityfair.baseFareCharge || "",
    baseDistance: cityfair.baseDistance || "",
    perDistance: cityfair.perDistanceCharge || "",
    minimumHrs: cityfair.minimumHrs || "", // Assuming this field exists or handles rental time
    perMinute: cityfair.perMinuteCharge || "",
    waitingCharge: cityfair.waitingCharge || "",
    freeWaitTime: cityfair.freeWaitTime || "",
    freeWaitAfterStart: cityfair.freeWaitTimeAfterStartRide || "",
    cancelRider: cityfair.cancellationChargeForRider || "",
    cancelDriver: cityfair.cancellationChargeForDriver || "",
    commissionType: cityfair.commissionType || "fixed",
    commissionRate: cityfair.commissionRate || "",
    chargeGoesTo: cityfair.chargeGoesTo || "admin",
    allowTax: cityfair.allowTax === "true" || cityfair.allowTax === true,
    tax: cityfair.taxId || "",
    allowAirport: cityfair.allowAirportCharge === "true" || cityfair.allowAirportCharge === true,
    airportRate: cityfair.airportChargeRate || "",
    allowPreference: cityfair.allowPreference === "true" || cityfair.allowPreference === true,
  });

  const getInitialPreferences = () => {
    if (cityfair.preferences && cityfair.preferences.length > 0) {
      // Map existing array of strings back to objects
      return cityfair.preferences.map((prefName, idx) => ({
        id: Date.now() + idx,
        name: prefName,
        // Since API gives one rate or maybe comma separated, just put it on the first one or leave empty
        price: idx === 0 ? (cityfair.preferenceRate || "") : "0"
      }));
    }
    return [];
  };

  const [preferences, setPreferences] = useState(getInitialPreferences());
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

  const fetchTaxes = async () => {
    setLoadingTaxes(true);
    try {
      const response = await axios.post(URLS.GetAllTax, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data?.taxes) {
        setTaxes(response.data.taxes);
      }
    } catch (err) {
      console.error("Error fetching taxes:", err);
    } finally {
      setLoadingTaxes(false);
    }
  };

  const fetchDriverRules = async () => {
    setLoadingRules(true);
    try {
      const response = await axios.post(
        URLS.GetAllDriverRules,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.data) {
        setDriverRules(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching driver rules:", err);
    } finally {
      setLoadingRules(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTaxes();
    fetchDriverRules();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneId || !vehicleGroupId) {
      alert("Missing Zone ID or Vehicle Group ID. Please try again from Vehicle Zones.");
      return;
    }

    if (validateForm()) {
      setSubmitLoading(true);
      try {
        const payload = {
          zoneId: zoneId,
          vehicleGroupId: vehicleGroupId,
          serviceCategoryId: formData.farePlan,
          baseFareCharge: formData.baseFare.toString(),
          baseDistance: formData.baseDistance.toString(),
          perDistanceCharge: formData.perDistance.toString(),
          perMinuteCharge: formData.perMinute.toString(),
          waitingCharge: formData.waitingCharge.toString(),
          freeWaitTime: formData.freeWaitTime.toString(),
          freeWaitTimeAfterStartRide: formData.freeWaitAfterStart.toString(),
          cancellationChargeForRider: formData.cancelRider.toString(),
          cancellationChargeForDriver: formData.cancelDriver.toString(),
          commissionType: formData.commissionType,
          commissionRate: formData.commissionRate.toString(),
          chargeGoesTo: formData.chargeGoesTo,
          allowTax: formData.allowTax ? "true" : "false",
          tax: formData.allowTax ? formData.tax : "",
          allowAirportCharge: formData.allowAirport ? "true" : "false",
          airportChargeRate: formData.allowAirport ? formData.airportRate.toString() : "",
          allowPreference: formData.allowPreference ? "true" : "false",
          selectPreference: formData.allowPreference && preferences.length > 0 ? preferences[0].name : "",
          preferenceRate: formData.allowPreference && preferences.length > 0 ? preferences[0].price : "",
          preferences: formData.allowPreference ? preferences.map(p => p.name) : []
        };

        const response = await axios.put(URLS.EditCityFair, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data?.success) {
          alert(response.data.message || "Updated successfully");
          navigate(-1); // Go back to vehicle zones table
        } else {
          alert(response.data?.message || "Failed to update fare plan");
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred while saving the prices.");
      } finally {
        setSubmitLoading(false);
      }
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
                      {loadingTaxes ? (
                        <option value="" disabled>Loading...</option>
                      ) : (
                        taxes.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.tax}%)
                          </option>
                        ))
                      )}
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

                {/* ================= PREFERENCES ================= */}
                {formData.allowPreference && (
                  <>
                    {/* Render Added Preferences */}
                    {preferences.map((item) => (
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

                    {/* Add New Preference Option */}
                    <div className="row g-3 align-items-end mt-2">
                      <div className="col-md-4">
                        <label className="form-label">Select Preference</label>
                        <select
                          className="form-select"
                          value={newPreference}
                          onChange={(e) => setNewPreference(e.target.value)}
                        >
                          <option value="">Select</option>
                          {loadingRules ? (
                            <option value="" disabled>Loading...</option>
                          ) : (
                            driverRules.map((rule) => (
                              <option key={rule._id} value={rule.name}>
                                {rule.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Preference Rate</label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={newPreferencePrice}
                            onChange={(e) => setNewPreferencePrice(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <button
                          type="button"
                          className="btn btn-outline-success w-100"
                          onClick={addPreference}
                        >
                          Add Preference
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ================= FOOTER BUTTONS ================= */}
            <div className="card-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                {submitLoading ? "Saving..." : "Save Prices"}
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