
import { useState, useEffect } from "react";
import CommonFooter from "../../components/footer/commonFooter";
import { user49 } from "../../utils/imagepath";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "bcbas",
    lastName: "sdcsc",
    email: "scs",
    phone: "scsc",
    username: "scdsc",
  });

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Profile</h4>
          </div>

          <div className="card-body profile-body">
            <form>
              <div className="profile-pic-upload mb-4">
                <img src={user49} alt="user" width="100" className="rounded" />
              </div>

              <div className="row">
                <div className="col-lg-6 mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-lg-6 mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-lg-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-lg-6 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default Profile;
