
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Surge Prices:", formData);
    
  };

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Vehicle Surge Prices (Per Day)</h5>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {days.map((day) => (
                  <div className="col-md-6 mb-3" key={day}>
                    <label className="form-label text-capitalize">
                      {day} Surge Price
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      name={day}
                      value={formData[day]}
                      onChange={handleChange}
                      className="form-control"
                      placeholder={`Enter ${day} surge (e.g. 1.5)`}
                    />
                  </div>
                ))}
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary px-4">
                  Update Surge Prices
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default VehicleSurgePrice;
