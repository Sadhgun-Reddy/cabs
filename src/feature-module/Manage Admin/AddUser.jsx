import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { phoneAdd1 } from "../../utils/imagepath";

const AddUser = () => {
  const [status, setStatus] = useState(true);
  const route = all_routes;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    role: "",
  });

  // COMMON HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         image: file,
//       }));
//     }
//   };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adduser Data:", formData);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add User</h4>
          </div>
          <Link to="/User" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" />
            Back to User
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="accordion-item border mb-4">
            <div className="accordion-body">
              <div className="row">
                {/* DRIVER */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                  type="text"
                    name="modelName"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                  />
                </div>

                {/* Priority */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Email"
                    value={formData.email}
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

                {/* Down Grade */}
                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    onChange={handleChange} >
                        <option value="select">Select</option>
                        <option value="Admin">Admin</option>
                        <option value="user">User</option>
                        </select>
                </div>
              {/* </div> */}

                {/* IMAGE */}
                  <div className="col-md-6 mt-3">
                    <label className="form-label">
                                    Status{" "}
                                  </label>

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
                  Add User
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AddUser;
