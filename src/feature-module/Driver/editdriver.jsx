// import { useState } from "react";

// const EditDriver = () => {
//   const [step, setStep] = useState(1);

//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);

//   const General = ({ nextStep }) => (
//     <>
//       <h5 className="fw-bold mb-4">General</h5>

//       <div className="row">
//         <div className="col-md-6 mb-3">
//           <label>Profile Image</label>
//           <input type="file" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Full Name</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Email</label>
//           <input type="email" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Phone</label>
//           <input type="text" className="form-control" required />
//         </div>
//       </div>

//       <div className="text-end">
//         <button className="btn btn-primary" onClick={nextStep}>
//           Next →
//         </button>
//       </div>
//     </>
//   );

//   const Address = ({ nextStep, prevStep }) => (
//     <>
//       <h5 className="fw-bold mb-4">Address</h5>

//       <div className="row">
//         <div className="col-md-6 mb-3">
//           <label>Address</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Street Address</label>
//           <input type="text" className="form-control" />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Area / Locality</label>
//           <input type="text" className="form-control" />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Country</label>
//           <select className="form-select" required>
//             <option>India</option>
//             <option>USA</option>
//           </select>
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>State</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>City</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Postal Code</label>
//           <input type="text" className="form-control" required />
//         </div>
//       </div>

//       <div className="text-end">
//         <button className="btn btn-secondary me-2" onClick={prevStep}>
//           ← Previous
//         </button>
//         <button className="btn btn-primary" onClick={nextStep}>
//           Next →
//         </button>
//       </div>
//     </>
//   );

//   const Vehicle = ({ nextStep, prevStep }) => (
//     <>
//       <h5 className="fw-bold mb-4">Vehicle</h5>

//       <div className="row">
//         {/* <div className="col-md-6 mb-3">
//           <label>Fleet Manager</label>
//           <select className="form-select">
//             <option>Select Fleet Manager</option>
//           </select>
//         </div> */}

//         <div className="col-md-6 mb-3">
//           <label>Service</label>
//           <select className="form-select" required>
//             <option>Select Service</option>
//           </select>
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Service Categories</label>
//           <select className="form-select" required></select>
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Vehicle</label>
//           <select className="form-select" required></select>
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Model</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Plate Number</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Seat</label>
//           <input type="number" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Color</label>
//           <select className="form-select" required></select>
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Experience (Years)</label>
//           <input type="number" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Driver Charge</label>
//           <input type="number" className="form-control" required />
//         </div>
//       </div>

//       <div className="text-end">
//         <button className="btn btn-secondary me-2" onClick={prevStep}>
//           ← Previous
//         </button>
//         <button className="btn btn-primary" onClick={nextStep}>
//           Next →
//         </button>
//       </div>
//     </>
//   );

//   const Payout = ({ nextStep, prevStep }) => (
//     <>
//       <h5 className="fw-bold mb-4">Payout Details</h5>

//       <div className="row">
//         <div className="col-md-6 mb-3">
//           <label>Bank Account No.</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Bank Name</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Holder Name</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Swift</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Routing Number</label>
//           <input type="text" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Paypal Email</label>
//           <input type="email" className="form-control" required />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label>Default</label>
//           <select className="form-select" required>
//             <option>Bank</option>
//             <option>Paypal</option>
//           </select>
//         </div>
//       </div>

//       <div className="text-end">
//         <button className="btn btn-secondary me-2" onClick={prevStep}>
//           ← Previous
//         </button>
//         <button className="btn btn-primary" onClick={nextStep}>
//           Next →
//         </button>
//       </div>
//     </>
//   );

//   const Additional = ({ prevStep }) => (
//     <>
//       <h5 className="fw-bold mb-4">Additional Information</h5>

//       <div className="mb-4">
//         <label>Location (Map)</label>
//         <div className="border rounded p-5 text-center bg-light">
//           Map Placeholder
//         </div>
//       </div>

//       <div className="form-check form-switch mb-3">
//         <input className="form-check-input" type="checkbox" />
//         <label className="form-check-label">Is Online</label>
//       </div>

//       <div className="form-check form-switch mb-3">
//         <input className="form-check-input" type="checkbox" />
//         <label className="form-check-label">Is Verified</label>
//       </div>

//       <div className="form-check form-switch mb-3">
//         <input className="form-check-input" type="checkbox" />
//         <label className="form-check-label">Is On Ride</label>
//       </div>

//       <div className="form-check form-switch mb-3">
//         <input className="form-check-input" type="checkbox" />
//         <label className="form-check-label">Status</label>
//       </div>

//       <div className="text-end">
//         <button className="btn btn-secondary me-2" onClick={prevStep}>
//           ← Previous
//         </button>
//         <button className="btn btn-success">Save Driver</button>
//       </div>
//     </>
//   );

//   return (
//     <div className="page-wrapper">
//       <div className="container py-4">
//         <div className="card shadow-sm border-0 rounded-4">
//           <div className="card-body p-4">
//             {/* Step Headings */}
//             <ul className="nav mb-4">
//               <li className="nav-item">
//                 <span className={`nav-link ${step === 1 && "active"}`}><i className="ti ti-user me-1" />
//                   General
//                 </span>
//               </li>
//               <li className="nav-item">
//                 <span className={`nav-link ${step === 2 && "active"}`}><i className="ti ti-lock me-1" />
//                   Address
//                 </span>
//               </li>
//               <li className="nav-item">
//                 <span className={`nav-link ${step === 3 && "active"}`}><i className="ti ti-user me-1" />
//                   Vehicle
//                 </span>
//               </li>
//               <li className="nav-item">
//                 <span className={`nav-link ${step === 4 && "active"}`}><i className="ti ti-lock me-1" />
//                   Payout Details
//                 </span>
//               </li>
//               <li className="nav-item">
//                 <span className={`nav-link ${step === 5 && "active"}`}><i className="ti ti-lock me-1" />
//                   Additional Info
//                 </span>
//               </li>
//             </ul>

//             {/* Step Forms */}
//             {step === 1 && <General nextStep={nextStep} />}
//             {step === 2 && <Address nextStep={nextStep} prevStep={prevStep} />}
//             {step === 3 && <Vehicle nextStep={nextStep} prevStep={prevStep} />}
//             {step === 4 && <Payout nextStep={nextStep} prevStep={prevStep} />}
//             {step === 5 && <Additional prevStep={prevStep} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditDriver;






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
                      <input type="file" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Full Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input type="email" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Phone</label>
                      <input type="text" className="form-control" required />
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
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Country</label>
                      <select className="form-select" required>
                        <option value="">Select</option>
                        <option>India</option>
                        <option>USA</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>State</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>City</label>
                      <input type="text" className="form-control" required />
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
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Plate Number</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Seat</label>
                      <input type="number" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Experience (Years)</label>
                      <input type="number" className="form-control" required />
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
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Bank Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Holder Name</label>
                      <input type="text" className="form-control" required />
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
