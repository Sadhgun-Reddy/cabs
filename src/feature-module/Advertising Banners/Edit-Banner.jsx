import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const EditBanner = () => {
  const route = all_routes;

  const [formData, setFormData] = useState({
    image: null,
    link: "",
    priority: "",
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
            <h4>Edit Banner</h4>
          </div>
          <Link to={route.advertisingbanner} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Advrtising Banner
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
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
                </div>

                {/* LINK */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Link</label>
                  <input
                    type="link"
                    className="form-control"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="Enter Link"
                    required
                  />
                </div>

                {/* PRIORITY */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Priority</label>
                  <input
                    name="priority"
                    type="number"
                    className="form-control"
                    value={formData.priority}
                    onChange={handleChange}
                    placeholder="Enter Priority"
                    required
                  />
                </div>

                {/* STATUS */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    onChange={handleChange}
                    required
                  >
                    <option value="select">Select Status</option>
                    <option value="select">Approved</option>
                    <option value="select">Pending</option>
                    <option value="select">Rejected</option>
                    </select>
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Update Banner
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBanner;
