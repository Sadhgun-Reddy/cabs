
import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";

const Addcoupons = () => {
  const route = all_routes;

  const [step, setStep] = useState(1);

  // SINGLE SOURCE OF TRUTH (NEW)
  const [formData, setFormData] = useState({
    // -------- GENERAL --------
    title: "",
    description: "",
    code: "",
    type: "",
    isExpired: false,
    status: true,

    // -------- RESTRICTION --------
    minRideFare: "",
    applyAll: false,
    serviceType: "",
    vehicleType: "",

    // -------- USAGE --------
    isUnlimited: false,
    usagePerCoupon: "",
    usagePerRide: "",
  });

  // COMMON HANDLER
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Coupon Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Coupons</h4>
          </div>
          <Link to={route.coupons} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to coupons
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">

              {/* ================= GENERAL ================= */}
              {step === 1 && (
                <>
                  <h5 className="mb-3">General</h5>

                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Code</label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      value={formData.code}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat</option>
                    </select>
                  </div>

                  <div className="d-flex gap-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isExpired"
                        checked={formData.isExpired}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        Is Expired
                      </label>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        Status
                      </label>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* ================= RESTRICTION ================= */}
              {step === 2 && (
                <>
                  <h5 className="mb-3">Restriction</h5>

                  <div className="mb-3">
                    <label className="form-label">Minimum Ride Fare</label>
                    <input
                      type="number"
                      name="minRideFare"
                      className="form-control"
                      value={formData.minRideFare}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="applyAll"
                      checked={formData.applyAll}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Apply All
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service Type</label>
                    <select
                      name="serviceType"
                      className="form-select"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="city">City</option>
                      <option value="outstation">Outstation</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      className="form-select"
                      value={formData.vehicleType}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="bike">Bike</option>
                      <option value="auto">Auto</option>
                      <option value="car">Car</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* ================= USAGE ================= */}
              {step === 3 && (
                <>
                  <h5 className="mb-3">Usage</h5>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isUnlimited"
                      checked={formData.isUnlimited}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Unlimited Usage
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Usage Per Coupon</label>
                    <input
                      type="number"
                      name="usagePerCoupon"
                      className="form-control"
                      value={formData.usagePerCoupon}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Usage Per Ride</label>
                    <input
                      type="number"
                      name="usagePerRide"
                      className="form-control"
                      value={formData.usagePerRide}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Coupon
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addcoupons;
