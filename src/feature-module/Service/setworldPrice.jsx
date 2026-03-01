import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { URLS } from "../../url";
import CommonFooter from "../../components/footer/commonFooter";

const SetWorldPrice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cityfair = location.state?.farePrice || {};
  const isEditing = !!cityfair._id;

  const [zones, setZones] = useState([]);
  const [vehicleGroups, setVehicleGroups] = useState([]);
  const [fairPlans, setFairPlans] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [driverRules, setDriverRules] = useState([]);

  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingTaxes, setLoadingTaxes] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    zoneId: cityfair.zoneId ? (Array.isArray(cityfair.zoneId) ? cityfair.zoneId : [cityfair.zoneId]) : [],
    vehicleGroupId: cityfair.vehicleGroupId || "",
    fairPlanId: cityfair.fairPlanId || "",
    fairPlanName: cityfair.fairPlanName || "",
    baseFare: cityfair.baseFareCharge || "",
    baseDistance: cityfair.baseDistance || "",
    perDistance: cityfair.perDistanceCharge || "",
    minimumHrs: cityfair.minimumHrs || "",
    perMinute: cityfair.perMinuteCharge || "",
    waitingCharge: cityfair.waitingCharge || "",
    freeWaitTime: cityfair.freeWaitTime || "",
    // freeWaitAfterStart: cityfair.freeWaitTimeAfterStartRide || "",
    cancelRider: cityfair.cancellationChargeForRider || "",
    cancelDriver: cityfair.cancellationChargeForDriver || "",
    commissionType: cityfair.commissionType || "fixed",
    commissionRate: cityfair.commissionRate || "",
    chargeGoesTo: cityfair.chargeGoesTo || "admin",
    allowTax: cityfair.allowTax === "true" || cityfair.allowTax === true,
    taxId: cityfair.taxId ? (Array.isArray(cityfair.taxId) ? cityfair.taxId : [cityfair.taxId]) : [],
    allowAirport: cityfair.allowAirportCharge === "true" || cityfair.allowAirportCharge === true,
    airportRate: cityfair.airportChargeRate || "",
    allowPreference: cityfair.allowPreference === "true" || cityfair.allowPreference === true,
  });

  const getInitialPreferences = () => {
    if (cityfair.preferences && cityfair.preferences.length > 0) {
      return cityfair.preferences.map((prefName, idx) => ({
        id: Date.now() + idx,
        name: prefName,
        price: idx === 0 ? (cityfair.preferenceRate || "") : "0"
      }));
    }
    return [];
  };

  const [preferences, setPreferences] = useState(getInitialPreferences());
  const [newPreference, setNewPreference] = useState("");
  const [newPreferencePrice, setNewPreferencePrice] = useState("");

  const customSelectStyles = {
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#0985E2",
      borderRadius: "4px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#0985E2",
        color: "white",
      },
    }),
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Special logic for fair plan to store both ID and Name
    if (name === "fairPlanId") {
      setFormData((prev) => ({
        ...prev,
        fairPlanId: selectedOption ? selectedOption.value : "",
        fairPlanName: selectedOption ? selectedOption.label : "",
      }));
    } else if (name === "taxId" || name === "zoneId") {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption ? selectedOption.map((o) => o.value) : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption ? selectedOption.value : "",
      }));
    }
  };

  /* ===================== FETCH DROP DOWNS ===================== */

  const fetchZones = async () => {
    setLoadingZones(true);
    try {
      const response = await axios.post(URLS.GetActiveNormalZones, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data?.zones) setZones(response.data.zones);
    } catch (err) {
      console.error("Error fetching zones", err);
    } finally {
      setLoadingZones(false);
    }
  };

  const fetchVehicleGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await axios.post(URLS.GetActiveVehicleGroups, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data?.groups) setVehicleGroups(response.data.groups);
    } catch (err) {
      console.error("Error fetching vehicle groups", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchFairPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await axios.post(URLS.GetActiveFairPlans, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data?.fairPlans) setFairPlans(response.data.fairPlans);
    } catch (err) {
      console.error("Error fetching fair plans", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchTaxes = async () => {
    setLoadingTaxes(true);
    try {
      const response = await axios.post(URLS.GetAllTax, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data?.taxes) setTaxes(response.data.taxes);
    } catch (err) {
      console.error("Error fetching taxes", err);
    } finally {
      setLoadingTaxes(false);
    }
  };

  const fetchDriverRules = async () => {
    setLoadingRules(true);
    try {
      const response = await axios.post(URLS.GetAllDriverRules, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data?.data) setDriverRules(response.data.data);
    } catch (err) {
      console.error("Error fetching driver rules", err);
    } finally {
      setLoadingRules(false);
    }
  };

  const fetchCityFairDetails = async () => {
    if (!cityfair._id) return;
    setLoadingData(true);
    try {
      const response = await axios.post(
        URLS.ViewCityFair,
        { id: cityfair._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success && response.data.cityfair) {
        const data = response.data.cityfair;
        setFormData({
          zoneId: data.zoneId || [],
          vehicleGroupId: data.vehicleGroupId || "",
          fairPlanId: data.fairPlanId || "",
          fairPlanName: data.fairPlanName || "",
          baseFare: data.baseFareCharge || "",
          baseDistance: data.baseDistance || "",
          perDistance: data.perDistanceCharge || "",
          minimumHrs: data.minimumHrs || "",
          perMinute: data.perMinuteCharge || "",
          waitingCharge: data.waitingCharge || "",
          freeWaitTime: data.freeWaitTime || "",
          // freeWaitAfterStart: data.freeWaitTimeAfterStartRide || "",
          cancelRider: data.cancellationChargeForRider || "",
          cancelDriver: data.cancellationChargeForDriver || "",
          commissionType: data.commissionType || "fixed",
          commissionRate: data.commissionRate || "",
          chargeGoesTo: data.chargeGoesTo || "admin",
          allowTax: data.allowTax === "true" || data.allowTax === true,
          taxId: data.taxId ? (Array.isArray(data.taxId) ? data.taxId : [data.taxId]) : [],
          allowAirport: data.allowAirportCharge === "true" || data.allowAirportCharge === true,
          airportRate: data.airportChargeRate || "",
          allowPreference: data.allowPreference === "true" || data.allowPreference === true,
        });

        if (data.preferences && data.preferences.length > 0) {
          setPreferences(
            data.preferences.map((prefName, idx) => ({
              id: Date.now() + idx,
              name: prefName,
              price: idx === 0 ? (data.preferenceRate || "") : "0",
            }))
          );
        }
      }
    } catch (err) {
      console.error("Error fetching city fair details", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchZones();
    fetchVehicleGroups();
    fetchFairPlans();
    fetchTaxes();
    fetchDriverRules();
    if (isEditing) {
      fetchCityFairDetails();
    }
  }, []);

  /* ===================== FIX: Ensure fairPlanName is set after fairPlans load ===================== */
  useEffect(() => {
    // If we have a fairPlanId but fairPlanName is empty, try to find it from fairPlans
    if (formData.fairPlanId && !formData.fairPlanName && fairPlans.length > 0) {
      const found = fairPlans.find(fp => fp._id === formData.fairPlanId);
      if (found) {
        setFormData(prev => ({ ...prev, fairPlanName: found.planName }));
      }
    }
  }, [formData.fairPlanId, fairPlans]);

  /* ===================== PREFERENCES ===================== */

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
      { id: Date.now(), name: newPreference, price: newPreferencePrice },
    ]);
    setNewPreference("");
    setNewPreferencePrice("");
  };

  /* ===================== VALIDATION & SUBMIT ===================== */

  const validateForm = () => {
    const newErrors = {};
    if (!formData.zoneId || formData.zoneId.length === 0) newErrors.zoneId = "Zone is required";
    if (!formData.vehicleGroupId) newErrors.vehicleGroupId = "Vehicle Group is required";
    if (!formData.fairPlanId) newErrors.fairPlanId = "Fare Plan is required";

    const isPrimaryPlan = ["City Rides", "One Way", "Round Trip"].includes(formData.fairPlanName);
    if (!isPrimaryPlan) {
      if (!formData.minimumHrs || isNaN(formData.minimumHrs) || Number(formData.minimumHrs) < 0) {
        newErrors.minimumHrs = "Valid Minimum Hour is required";
      }
    }

    if (!formData.baseFare || isNaN(formData.baseFare) || Number(formData.baseFare) <= 0) {
      newErrors.baseFare = "Valid Base Fare is required";
    }
    if (!formData.baseDistance || isNaN(formData.baseDistance) || Number(formData.baseDistance) <= 0) {
      newErrors.baseDistance = "Valid Base Distance is required";
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
    if (loadingData) return;
    if (validateForm()) {
      setSubmitLoading(true);
      try {
        const payload = {
          zoneId: formData.zoneId,
          vehicleGroupId: formData.vehicleGroupId,
          fairPlanId: formData.fairPlanId,
          fairPlanName: formData.fairPlanName,
          minimumHrs: formData.minimumHrs.toString(),
          baseFareCharge: formData.baseFare.toString(),
          baseDistance: formData.baseDistance.toString(),
          perDistanceCharge: formData.perDistance.toString(),
          perMinuteCharge: formData.perMinute.toString(),
          waitingCharge: formData.waitingCharge.toString(),
          freeWaitTime: formData.freeWaitTime.toString(),
          // freeWaitTimeAfterStartRide: formData.freeWaitAfterStart.toString(),
          cancellationChargeForRider: formData.cancelRider.toString(),
          cancellationChargeForDriver: formData.cancelDriver.toString(),
          commissionType: formData.commissionType,
          commissionRate: formData.commissionRate.toString(),
          // chargeGoesTo: formData.chargeGoesTo,
          allowTax: formData.allowTax ? "true" : "false",
          taxId: formData.allowTax ? formData.taxId : [],
          allowAirportCharge: formData.allowAirport ? "true" : "false",
          airportChargeRate: formData.allowAirport ? formData.airportRate.toString() : "",
          allowPreference: formData.allowPreference ? "true" : "false",
          selectPreference: formData.allowPreference && preferences.length > 0 ? preferences[0].name : "",
          preferenceRate: formData.allowPreference && preferences.length > 0 ? preferences[0].price : "",
          preferences: formData.allowPreference ? preferences.map(p => p.name) : []
        };
        const endpoint = isEditing ? `${URLS.EditCityFair}/${cityfair._id}` : URLS.AddCityFair;
        const method = isEditing ? "put" : "post";

        // Add the id to the payload if we are editing
        if (isEditing) {
          payload.id = cityfair._id;
        }

        const response = await axios({
          method: method,
          url: endpoint,
          data: payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data?.success) {
          alert(response.data.message || (isEditing ? "Updated successfully" : "Added successfully"));
          navigate(-1);
        } else {
          alert(response.data?.message || "Failed to save fare plan price");
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
        {loadingData ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading details...</span>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h4>{isEditing ? "Edit Fare Plan Price" : "Add Fare Plan Price"}</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="row g-4">
                  {/* ================= NEW DROPDOWNS ================= */}
                  <div className="col-md-4">
                    <label className="form-label">Zone *</label>
                    <Select
                      classNamePrefix="react-select"
                      name="zoneId"
                      isMulti
                      options={zones.map((z) => ({ value: z._id, label: z.name }))}
                      value={zones.map((z) => ({ value: z._id, label: z.name })).filter(o => formData.zoneId.includes(o.value))}
                      onChange={handleSelectChange}
                      isLoading={loadingZones}
                      styles={customSelectStyles}
                      placeholder="Select Zone"
                    />
                    {errors.zoneId && <div className="text-danger small mt-1">{errors.zoneId}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Fair Plan *</label>
                    <Select
                      classNamePrefix="react-select"
                      name="fairPlanId"
                      options={fairPlans.map((fp) => ({ value: fp._id, label: fp.planName }))}
                      value={fairPlans.map((fp) => ({ value: fp._id, label: fp.planName })).find(o => o.value === formData.fairPlanId) || null}
                      onChange={handleSelectChange}
                      isLoading={loadingPlans}
                      placeholder="Select Fair Plan"
                    />
                    {errors.fairPlanId && <div className="text-danger small mt-1">{errors.fairPlanId}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Vehicle Group *</label>
                    <Select
                      classNamePrefix="react-select"
                      name="vehicleGroupId"
                      options={vehicleGroups.map((vg) => ({ value: vg._id, label: vg.name }))}
                      value={vehicleGroups.map((vg) => ({ value: vg._id, label: vg.name })).find(o => o.value === formData.vehicleGroupId) || null}
                      onChange={handleSelectChange}
                      isLoading={loadingGroups}
                      placeholder="Select Vehicle Group"
                    />
                    {errors.vehicleGroupId && <div className="text-danger small mt-1">{errors.vehicleGroupId}</div>}
                  </div>

                  {/* ================= CONDITIONAL MINIMUM HOUR ================= */}
                  {!["City Rides", "One Way", "Round Trip"].includes(formData.fairPlanName) && formData.fairPlanName && (
                    <div className="col-md-4">
                      <label className="form-label">Minimum Hour *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.minimumHrs ? "is-invalid" : ""}`}
                        name="minimumHrs"
                        value={formData.minimumHrs}
                        onChange={handleChange}
                        placeholder="Enter Minimum Hour"
                      />
                      {errors.minimumHrs && <div className="invalid-feedback d-block">{errors.minimumHrs}</div>}
                    </div>
                  )}

                  {/* ================= BASIC PRICING ================= */}

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
                    <label className="form-label">Waiting Charge &nbsp; <small className="text-muted">(after free wait time)</small></label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        name="waitingCharge"
                        value={formData.waitingCharge}
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
                      value={formData.freeWaitTime}
                      onChange={handleChange}
                    />
                  </div>

                  {/* <div className="col-md-4">
                    <label className="form-label">
                      Free Wait Time After Start Ride
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="freeWaitAfterStart"
                      value={formData.freeWaitAfterStart}
                      onChange={handleChange}
                    />
                  </div> */}

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
                        value={formData.cancelRider}
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
                        value={formData.cancelDriver}
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

                  {/* <div className="col-md-4">
                    <label className="form-label">Charge Goes To</label>
                    <select
                      className="form-select"
                      name="chargeGoesTo"
                      value={formData.chargeGoesTo}
                      onChange={handleChange}
                    >
                      <option value="select">Select</option>
                      <option value="admin">Admin</option>
                      <option value="driver">Driver</option>
                      <option value="company">Company</option>
                    </select>
                  </div> */}

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
                      <Select
                        isMulti
                        classNamePrefix="react-select"
                        name="taxId"
                        options={taxes.map((t) => ({
                          value: t._id,
                          label: `${t.name} (${t.tax}%)`,
                        }))}
                        value={taxes
                          .map((t) => ({ value: t._id, label: `${t.name} (${t.tax}%)` }))
                          .filter((o) => formData.taxId.includes(o.value))}
                        onChange={handleSelectChange}
                        isLoading={loadingTaxes}
                        styles={customSelectStyles}
                        placeholder="Select Tax"
                      />
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
                        <span className="input-group-text">%</span>
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
                  {submitLoading ? "Saving..." : (isEditing ? "Update Prices" : "Save Prices")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <CommonFooter />
    </div>
  );
};

export default SetWorldPrice;