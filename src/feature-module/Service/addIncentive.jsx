import { useState } from "react";

const AddIncentivesModal = () => {
  const [period, setPeriod] = useState("");


  const [levels, setLevels] = useState([
    { id: 1, target: 1, amount: 5 },
    { id: 2, target: 2, amount: 10 },
    { id: 3, target: 3, amount: 15 },
    { id: 4, target: 4, amount: 20 },
  ]);

  /* ================= HANDLERS ================= */

  const updateLevel = (id, field, value) => {
    setLevels((prev) =>
      prev.map((lvl) => (lvl.id === id ? { ...lvl, [field]: value } : lvl)),
    );
  };

  const removeLevel = (id) => {
    setLevels((prev) => prev.filter((lvl) => lvl.id !== id));
  };

  const addLevel = () => {
    if (levels.length >= 5) return;

    const nextLevel = levels.length + 1;

    setLevels([
      ...levels,
      {
        id: Date.now(),
        target: nextLevel,
        amount: "",
      },
    ]);
  };

  const handleSubmit = () => {
    console.log({
      period,
      currency: "USD",
      levels,
    });
  };


  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content rounded-4">
          {/* ================= HEADER ================= */}
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">
              Configure Incentives for Driver
            </h5>
            <button type="btn" className="btn-close" />
          </div>

          {/* ================= BODY ================= */}
          <div className="modal-body">
            <div className="row g-4 mb-4">
              {/* Incentive Period */}
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  Incentive Period <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Currency */}
              <div className="col-md-6">
                <label className="form-label fw-medium">Currency</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="text"
                    className="form-control"
                    value="Currency will be applied to all levels"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* ================= LEVELS ================= */}
            <h6 className="fw-semibold mb-3">
              Incentive Levels (Up to 5 levels)
            </h6>

            {levels.map((lvl, index) => (
              <div key={lvl.id} className="border rounded-3 p-4 mb-3">
                <div className="row align-items-end g-3">
                  {/* Level Label */}
                  <div className="col-md-2 fw-semibold text-muted">
                    Level - {index + 1}
                  </div>

                  {/* Target Rides */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Target Rides <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={lvl.target}
                      onChange={(e) =>
                        updateLevel(lvl.id, "target", e.target.value)
                      }
                    />
                  </div>

                  {/* Incentive Amount */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Incentive Amount <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={lvl.amount}
                        onChange={(e) =>
                          updateLevel(lvl.id, "amount", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-danger w-100"
                      onClick={() => removeLevel(lvl.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Level */}
            <button
              className="btn btn-outline-primary"
              onClick={addLevel}
              disabled={levels.length >= 5}
            >
              + Add Level
            </button>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="modal-footer">
            <button className="btn btn-outline-secondary me-2 p-2"
            data-bs-dismiss="modal">
              Cancel
            </button>
            <button className="btn btn-primary me-2 p-2" onClick={handleSubmit}>
              Save Incentives
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIncentivesModal;
