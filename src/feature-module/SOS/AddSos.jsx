import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { image, phoneAdd1 } from "../../utils/imagepath";


const AddSos = () => {
  const [status, setStatus] = useState(true);
  const route = all_routes;

  const [formData, setFormData] = useState({
    image: null,
    title: "",
    phone: "",
    zones: "",
  });

  // COMMON HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adduser Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add SOS</h4>
          </div>
          <Link to="/SOS" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to SOS
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* SOS Image */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">SOS Image</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Number Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                {/* Decription */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="modelName"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Number"
                    required
                  />
                </div>

                {/* Zone */}
                <div className="col-md-6">
                  <label className="form-label">Zones</label>
                  <select className="form-select" onChange={handleChange}>
                    <option value="select">Select Zone</option>
                    <option value="hyderabad">Hyderabad</option>
                  </select>
                </div>


                {/* Status */}
                <div className="col-md-6 mt-3">
                  <label className="form-label">Status </label>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="zoneStatus"
                      checked={status}
                      onChange={() => setStatus(!status)}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="zoneStatus"
                    >
                      {status ? "" : ""}
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Add SOS
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSos;
