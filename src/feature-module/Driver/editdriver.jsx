
import { useState } from "react";

const EditDriver = () => {
  const [step, setStep] = useState(1);

  // Validate before moving forward
  const validateAndGo = (next) => {
    const form = document.getElementById("driverForm");
    if (form.checkValidity()) {
      setStep(next);
    } else {
      form.reportValidity();
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber > step) {
      validateAndGo(stepNumber);
    } else {
      setStep(stepNumber);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("driverForm");
    if (form.checkValidity()) {
      alert("Driver Saved Successfully ✅");
    } else {
      form.reportValidity();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">

            <form id="driverForm" onSubmit={handleSubmit}>

              {/* STEP HEADINGS */}
              <ul className="nav nav mb-4">
                {["General", "Address", "Vehicle", "Payout", "Additional"].map(
                  (label, index) => (
                    <li className="nav-item" key={index}>
                      <button
                        type="button"
                        className={`nav-link ${step === index + 1 ? "active" : ""}`}
                        onClick={() => handleStepClick(index + 1)}
                      >
                        {label}
                      </button>
                    </li>
                  )
                )}
              </ul>

              {/* STEP 1 - GENERAL */}
              {step === 1 && (
                <>
                  <h5 className="fw-bold mb-4">General</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Profile Image</label>
                      <input type="file" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Full Name</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input type="email" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Phone</label>
                      <input type="text" className="form-control"  />
                    </div>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => validateAndGo(2)}
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2 - ADDRESS */}
              {step === 2 && (
                <>
                  <h5 className="fw-bold mb-4">Address</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Address</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Country</label>
                      <select className="form-select" >
                        <option value="">Select</option>
                        <option>India</option>
                        <option>USA</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>State</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>City</label>
                      <input type="text" className="form-control"  />
                    </div>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setStep(1)}
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => validateAndGo(3)}
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 - VEHICLE */}
              {step === 3 && (
                <>
                  <h5 className="fw-bold mb-4">Vehicle</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Vehicle Model</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Plate Number</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Seat</label>
                      <input type="number" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Experience (Years)</label>
                      <input type="number" className="form-control"  />
                    </div>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setStep(2)}
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => validateAndGo(4)}
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 4 - PAYOUT */}
              {step === 4 && (
                <>
                  <h5 className="fw-bold mb-4">Payout Details</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Bank Account No.</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Bank Name</label>
                      <input type="text" className="form-control"  />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Holder Name</label>
                      <input type="text" className="form-control"  />
                    </div>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setStep(3)}
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => validateAndGo(5)}
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 5 - ADDITIONAL */}
              {step === 5 && (
                <>
                  <h5 className="fw-bold mb-4">Additional Info</h5>

                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Is Online</label>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setStep(4)}
                    >
                      ← Previous
                    </button>
                    <button type="submit" className="btn btn-success">
                      Save Driver
                    </button>
                  </div>
                </>
              )}

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;
