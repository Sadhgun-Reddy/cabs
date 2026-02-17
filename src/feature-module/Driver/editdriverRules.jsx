import { useState } from "react";

const EditDriverRules = () => {
  const [step, setStep] = useState(1);

  const General = ({ nextStep }) => (
    <>
      <h5 className="fw-bold mb-4"></h5>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Rule Image</label>
          <input type="file" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label>Title</label>
          <input type="text" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label>Select Vehicle Type</label>
          <select type="email" className="form-select" required>
            <option>Car</option>
            <option>Bike</option>
            </select>
        </div>

        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" />
          <label className="form-check-label">Status</label>
        </div>
      </div>

      <div className="text-end">
        <button className="btn btn-primary" onClick={nextStep}>
          Save and Exit
        </button>
      </div>
    </>
  );

  return (
    <div className="page-wrapper">
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            {/* Step Headings */}
            <ul className="nav mb-4">
              <li className="nav-item">
                <span className={`nav-link ${step === 1 && "active"}`}>
                  
                  Edit Driver Rule
                </span>
              </li>
            </ul>
            
            {/* Step Forms */}
            {step === 1 && <General nextStep />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriverRules;
