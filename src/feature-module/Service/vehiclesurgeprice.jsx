import { useState } from "react";
import CommonFooter from "../../components/footer/commonFooter";

const VehicleSurgePrice = () => {
  const [formData, setFormData] = useState({
    sunday: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
            <h4>Vehicle Surge Prices</h4>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-4">
                {/* ================= BASIC PRICING ================= */}
                <div className="col-4">
                  <label className="form-label">
                    Sunday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="baseFare"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label className="form-label">
                    Monday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="baseDistance"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label className="form-label">
                    Tuesday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="perDistance"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label className="form-label">
                    Thursday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="perDistance"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label className="form-label">
                    Wednesday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="perMinute"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label className="form-label">
                    Friday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="waitingCharge"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-4">
                  <label className="form-label">
                    Saturday (01:00:00 - 23:00:00)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="text"
                      className="form-control"
                      name="freeWaitTime"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= FOOTER BUTTONS ================= */}
            <div className="card-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Surge Prices
              </button>
            </div>
          </form>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default VehicleSurgePrice;
