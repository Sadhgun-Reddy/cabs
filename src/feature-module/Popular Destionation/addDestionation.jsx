import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const AddNewDestionation = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    image: null,
    name: "",
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
    console.log("Destionation Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Destionation</h4>
          </div>
          <Link to={route.popualrdestionation} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Destionation
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* DRIVER */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="location name"
                    className="form-select"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Destionation Name"
                    required
                  />
                </div>

                {/* DOCUMENT IMAGE */}
                <div className="col-md-6">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Add Destionation
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* IMAGE UPLOAD STYLES */}
      <style>{`
        .upload-box {
          width: 150px;
          height: 150px;
          border: 2px dashed #dee2e6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .upload-label {
          font-size: 28px;
          color: #6c757d;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AddNewDestionation;
