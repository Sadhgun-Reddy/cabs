import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { URLS } from "../../url";

const AddSurgePrice = () => {
  const [peakZones, setPeakZones] = useState([]);
  const [fairPlans, setFairPlans] = useState([]);
  const [vehicleGroups, setVehicleGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    zoneId: "",
    fairPlanId: "",
    vehicleGroupId: "",
    percentage: "",
    startTime: "",
    endTime: "",
    day: "",
    status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [zonesRes, plansRes, groupsRes] = await Promise.all([
          axios.post(URLS.GetActivePeakZones, {}, { headers }),
          axios.post(URLS.GetActiveFairPlans, {}, { headers }),
          axios.post(URLS.GetActiveVehicleGroups, {}, { headers }),
        ]);

        if (zonesRes.data?.zones) setPeakZones(zonesRes.data.zones);
        if (plansRes.data?.fairPlans) setFairPlans(plansRes.data.fairPlans);
        if (groupsRes.data?.groups) setVehicleGroups(groupsRes.data.groups);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const payload = {
        ...formData,
        percentage: Number(formData.percentage),
      };

      const res = await axios.post(URLS.AddSurgePrice, payload, { headers });

      if (res.data.success) {
        toast.success(res.data.message || "Surge price added successfully!");
        navigate("/surgePrices");
      } else {
        toast.error(res.data.message || "Failed to add surge price.");
      }
    } catch (error) {
      console.error("Error adding surge price:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while adding.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">

        {/* Page Header */}
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4>Add Surge Price</h4>
            {/* <h6 className="text-muted">Update surge pricing details</h6> */}
          </div>
          <Link to="/surgePrices" className="btn btn-secondary">
            <i className="ti ti-arrow-left me-1" /> Back to Surge Prices
          </Link>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>

              {/* Peak Zones & Fair Plans */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Peak Zone <span className="text-danger">*</span>
                  </label>
                  <select
                    name="zoneId"
                    className="form-select"
                    value={formData.zoneId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Peak Zone</option>
                    {peakZones.map((zone) => (
                      <option key={zone._id} value={zone._id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Fair Plan <span className="text-danger">*</span>
                  </label>
                  <select
                    name="fairPlanId"
                    className="form-select"
                    value={formData.fairPlanId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Fair Plan</option>
                    {fairPlans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.planName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Group & Percentage */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Vehicle Group <span className="text-danger">*</span>
                  </label>
                  <select
                    name="vehicleGroupId"
                    className="form-select"
                    value={formData.vehicleGroupId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vehicle Group</option>
                    {vehicleGroups.map((vg) => (
                      <option key={vg._id} value={vg._id}>
                        {vg.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Percentage (%) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="percentage"
                    className="form-control"
                    value={formData.percentage}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                    required
                  />
                </div>
              </div>

              {/* Start Time & End Time - Same Row */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Start Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    className="form-control"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    End Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    className="form-control"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Day Dropdown */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Day <span className="text-danger">*</span>
                  </label>
                  <select
                    name="day"
                    className="form-select"
                    value={formData.day}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Status
                  </label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-3">
                <Link
                  to="/surgePrices"
                  className="btn btn-light me-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className="ti ti-device-floppy me-1" />
                  )}
                  Add Price
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddSurgePrice;