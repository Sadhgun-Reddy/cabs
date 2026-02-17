import { useState } from "react";

const SendNotification = () => {
  const [formData, setFormData] = useState({
    sendTo: "",
    image: null,
    title: "",
    message: "",
    url: "",
    schedule: false,
    scheduleAt: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-header">
            <h4>Send Notification</h4>
          </div>

          <div className="card-body">
            <div className="row g-4">
              {/* ================= LEFT FORM ================= */}
              <div className="col-lg-7">
                <div className="row g-3">
                  {/* SEND TO */}
                  <div className="col-md-6">
                    <label className="form-label">Send To</label>
                    <select
                      className="form-select"
                      name="sendTo"
                      value={formData.sendTo}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="all">All Users</option>
                      <option value="drivers">Drivers</option>
                      <option value="riders">Riders</option>
                    </select>
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
                    <span className="text-muted">
                      *Upload image size 100x100px recommended
                    </span>
                  </div>

                  {/* TITLE */}
                  <div className="col-md-12">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter notification title"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div className="col-md-12">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter message (max 4 lines)"
                    />
                  </div>

                  {/* URL */}
                  <div className="col-md-12">
                    <label className="form-label">Redirect URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* SCHEDULE SWITCH */}
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="schedule"
                        checked={formData.schedule}
                        onChange={handleChange}
                      />
                      <label className="form-check-label ms-2">
                        Schedule Notification
                      </label>
                    </div>
                  </div>

                  {/* SCHEDULE DATE */}
                  {formData.schedule && (
                    <div className="col-md-6">
                      <label className="form-label">Schedule At</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="scheduleAt"
                        value={formData.scheduleAt}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ================= RIGHT IMAGE ================= */}
              <div className="col-lg-5 d-flex align-items-center justify-content-center">
                <div
                  className="w-100 h-100 border rounded d-flex align-items-center justify-content-center text-muted"
                  style={{ minHeight: "320px" }}
                >
                  <img
                    src="/src/assets/img/authentication/login.jpg"
                    alt="Notification Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "500px", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= FOOTER BUTTON ================= */}
          <div className="card-footer text-end">
            <button className="btn btn-primary">Send Notification</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;
