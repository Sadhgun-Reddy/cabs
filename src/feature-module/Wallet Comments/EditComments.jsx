import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const EditComments = () => {
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
            <h4>Edit Comment</h4>
          </div>
          <Link to={route.walletcomments} className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to Wallet Comments
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
                  type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
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

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-outline-success">
                  Update Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default EditComments;
