import { Link } from "react-router-dom";

export default function Export() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card export-card position-relative">

          {/* Close Button (Top Right) */}
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>

          {/* Header */}
          <div className="card-header">
            <h5 className="mb-0">Export</h5>
          </div>

          <hr />

          {/* Body */}
          <div className="card-body">
            <form className="form-export">

              <div className="text-center mb-4">
                <img
                  src="/src/assets/img/export.svg"
                  alt="export"
                  className="img"
                  style={{ maxWidth: "50px" }}
                />
              </div>

              {/* Export Format Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Select Export Format
                </label>

                <select className="form-select">
                  <option value="">Choose format</option>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              {/* Footer Actions */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link
                  to="#"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>

                <button type="submit" className="btn btn-primary">
                  <i className="ti ti-download me-1" />
                  Export
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
