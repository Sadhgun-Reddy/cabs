import { useState } from "react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Password change submitted:", formData);

  };

  return (
    <div className="page-wrapper">
    <div className="containner mt-5">
        <div className="row">
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <div className="mb-3">
        <label className="form-label">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          className="form-control"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">New Password</label>
        <input
          type="password"
          name="newPassword"
          className="form-control"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="form-control"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
        />
      </div>

      <div className="text-end">
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </div>
    </form>
    </div>
    </div>
    </div>
  );
};

export default ChangePassword;
