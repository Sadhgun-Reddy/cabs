import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const AddVehicleGroup = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    image: null,
    groupname: "",
    description: "",
    priority: "",
    grade: "",
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
            <h4>Add Vehicle Group</h4>
          </div>
          <Link to="/vehicleGroup" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Vehicle 
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* DRIVER */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Group Name</label>
                  <input
                  type="text"
                    name="modelName"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Group Name"
                    required
                  />
                </div>

                {/* Priority */}
                <div className="col-md-6">
                  <label className="form-label">Priority</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Priority"
                    value={formData.priority || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  />
                </div>
              </div>

                <div className="row">
                {/* Decription */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Decription</label>
                  <input
                  type="text"
                    name="modelName"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    required
                  />
                </div>

                {/* Down Grade */}
                <div className="col-md-6">
                  <label className="form-label">Down Grade</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Grade"
                    value={formData.grade || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                  />
                </div>
              </div>

                {/* IMAGE */}
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
                    {/* <span className="text-muted">
                      *Upload image size 100x100px recommended
                    </span> */}
                  </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AddVehicleGroup;
