import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";
import axios from "axios";

export default function Verifieddriver() {
  const navigate = useNavigate();

  /* ===================== STATE ===================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Popup message state
  const [popupMessage, setPopupMessage] = useState({
    show: false,
    text: "",
    type: "success",
  });

  // Reject modal state (for KYC rejection)
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // NEW: Deactivate modal state (for status change active → inactive)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateDriver, setDeactivateDriver] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState("");

  /* ===================== HANDLERS ===================== */
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter(
      (item) =>
        item.Name?.toLowerCase().includes(query) ||
        item.phonenumber?.includes(query) ||
        item.Email?.toLowerCase().includes(query),
    );
  }, [tableData, searchQuery]);

  // Helper: convert boolean status to API string
  const boolToStatus = (bool) => (bool ? "active" : "blocked");

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
    setSelectionVersion((v) => v + 1);
  };

  const handleSelectAll = (checked) => {
    setSelectedRows((prev) => {
      const visibleIds = filteredData.map((row) => row.id);
      if (checked) {
        return [...new Set([...prev, ...visibleIds])];
      } else {
        return prev.filter((id) => !filteredData.some((row) => row.id === id));
      }
    });
    setSelectionVersion((v) => v + 1);
  };

  const allVisibleSelected =
    filteredData.length > 0 &&
    filteredData.every((row) => selectedRows.includes(row.id));

  // MODIFIED: toggleStatus now opens deactivate modal when going from active → inactive
  const toggleStatus = (id) => {
    const item = tableData.find((item) => item.id === id);
    if (!item) return;
    const newStatus = !item.Status;
    // If currently active and trying to deactivate -> open modal
    if (item.Status === true && newStatus === false) {
      setDeactivateDriver({ id: item.id, name: item.Name });
      setDeactivateReason("");
      setShowDeactivateModal(true);
    } else {
      // If currently inactive and trying to activate, update directly
      updateDriverStatus([id], newStatus);
    }
  };

  // Bulk actions
  const handleBulkStatus = (status) => {
    if (!selectedRows.length) return;
    updateDriverStatus(selectedRows, status);
    setSelectedRows([]);
    setSelectionVersion((v) => v + 1);
  };

  // Navigate to documents page
  const goToDriverDocuments = (driverId, driverName) => {
    navigate("/driverDocument", { state: { driverId, driverName } });
  };

  // Show popup message and auto-hide after 3 seconds
  const showPopup = (message, type = "success") => {
    setPopupMessage({ show: true, text: message, type });
    setTimeout(() => {
      setPopupMessage({ show: false, text: "", type: "success" });
    }, 3000);
  };

  // Reject driver (opens modal)
  const openRejectModal = (driver) => {
    setSelectedDriver(driver);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Confirm rejection (KYC)
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      showPopup("Reason is required to reject a driver.", "danger");
      return;
    }
    if (!selectedDriver) return;
    try {
      await updateDriverKycStatus(selectedDriver.id, "rejected", rejectReason);
      setShowRejectModal(false);
      setSelectedDriver(null);
      setRejectReason("");
      showPopup("Driver rejected successfully!", "success");
    } catch (err) {
      showPopup("Failed to reject driver. Please try again.", "danger");
    }
  };

  // NEW: Confirm deactivation (status change)
  const handleDeactivateConfirm = async () => {
    if (!deactivateDriver) return;
    if (!deactivateReason.trim()) {
      showPopup("Reason is required to inactivate driver.", "danger");
      return;
    }
    try {
      await updateDriverStatus([deactivateDriver.id], false, deactivateReason);
      setShowDeactivateModal(false);
      setDeactivateDriver(null);
      setDeactivateReason("");
      showPopup("Driver inactivated successfully!", "success");
    } catch (err) {
      showPopup("Failed to inactivate driver. Please try again.", "danger");
    }
  };

  // MODIFIED: API call to update account status (active/inactive) with optional reason
  const updateDriverStatus = async (driverId, newStatus, reason = "") => {
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        userId: Array.isArray(driverId) ? driverId[0] : driverId,
        status: boolToStatus(newStatus),
      };
      if (reason) {
        payload.blockedReason = reason; // Adjust field name if your API expects something else
      }

      await axios.put(URLS.UpdateDriverStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchDrivers();
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update status");
      showPopup("Failed to update status", "danger");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Fetch Drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        URLS.GetAllDrivers,
        { kycStatus: "verified" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const user = res.data?.user || [];
      const formattedData = user.map((user) => ({
        id: user.driverId || user._id,
        Name: user.name,
        Email: user.email,
        phonenumber: user.phone,
        Status: user.status === "active",
        date: user.logCreatedDate,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Update driver KYC status (used for reject only)
  const updateDriverKycStatus = async (
    driverId,
    newStatus,
    blockedReason = "",
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        userId: driverId,
        kycStatus: newStatus,
      };

      if (newStatus === "rejected" && blockedReason) {
        payload.kycRejectedReason = blockedReason;
      }

      await axios.put(URLS.UpdateDriverKycStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchDrivers();
    } catch (err) {
      if (err.response) {
        setError(
          `Update failed: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`,
        );
      } else if (err.request) {
        setError("No response from server. Check network or CORS.");
      } else {
        setError("Failed to update driver status");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ===================== COLUMNS ===================== */
  const columns = useMemo(
    () => [
      // (checkbox column commented out)
      {
        header: "Sl.No",
        body: (_row, options) => options.rowIndex + 1 + (page - 1) * rows,
      },
      {
        header: "Name",
        field: "Name",
      },
      {
        header: "Phone Number",
        field: "phonenumber",
      },
      {
        header: "Email",
        field: "Email",
      },
      {
        header: "Status",
        body: (row) => (
          <div className="form-check form-switch">
            <input
              className={`form-check-input ${
                row.Status ? "bg-success" : "bg-danger"
              }`}
              type="checkbox"
              checked={row.Status}
              onChange={() => toggleStatus(row.id)}
            />
          </div>
        ),
      },
      {
        header: "Created Date",
        body: (row) =>
          row?.date
            ? new Date(row.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "--",
      },
      {
        header: "Actions",
        body: (row) => (
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="/viewdriverDetails"
              state={{ driverId: row.id }}
              title="Driver Details"
            >
              <i className="ti ti-eye text-primary" />
            </Link>
            {row.Status && (
              <Link
                to="#"
                className="p-2"
                title="Reject Driver"
                onClick={(e) => {
                  e.preventDefault();
                  openRejectModal({ id: row.id, name: row.Name });
                }}
              >
                <i className="ti ti-ban text-danger" />
              </Link>
            )}
            {/* <button ...> (documents button commented out) */}
          </div>
        ),
      },
    ],
    [selectedRows, filteredData, allVisibleSelected, page, rows, tableData],
  );

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Popup Message */}
        {popupMessage.show && (
          <div
            className={`alert alert-${popupMessage.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`}
            style={{ zIndex: 9999, minWidth: "250px" }}
            role="alert"
          >
            {popupMessage.text}
            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setPopupMessage({ show: false, text: "", type: "success" })
              }
            ></button>
          </div>
        )}

        <div className="page-header">
          <div className="page-title">
            <h4>Verified Drivers</h4>
          </div>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Rows dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-white dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {rows}
                </button>
                <ul className="dropdown-menu">
                  {[5, 10, 15, 20, 25].map((num) => (
                    <li key={num}>
                      <button
                        className="dropdown-item"
                        onClick={() => setRows(num)}
                      >
                        {num}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <SearchFromApi
              callback={handleSearch}
              rows={rows}
              setRows={setRows}
            />
          </div>

          <div className="card-body">
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {!loading && !error && (
              <div className="table-responsive">
                <PrimeDataTable
                  key={selectionVersion}
                  column={columns}
                  data={filteredData}
                  totalRecords={filteredData.length}
                  rows={rows}
                  onPage={(e) => setPage(e.page + 1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <CommonFooter />

      {/* Reject Modal (KYC) */}
      {showRejectModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Driver</h5>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Driver:</strong> {selectedDriver?.name}
                  </p>
                  <div className="mb-3">
                    <label htmlFor="rejectReason" className="form-label">
                      Reason for rejecting
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="rejectReason"
                      className="form-control"
                      rows="3"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      required
                    />
                    {!rejectReason.trim() && (
                      <div className="invalid-feedback">
                        Reason is required.
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleRejectConfirm}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* NEW: Deactivate Modal (for status change) */}
      {showDeactivateModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Inactive Driver</h5>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Driver:</strong> {deactivateDriver?.name}
                  </p>
                  <div className="mb-3">
                    <label htmlFor="inactivateReason" className="form-label">
                      Reason for Inactivating
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="deactivateReason"
                      className={`form-control ${
                        !deactivateReason.trim() && showDeactivateModal ? "is-invalid" : ""
                      }`}
                      rows="3"
                      value={deactivateReason}
                      onChange={(e) => setDeactivateReason(e.target.value)}
                      required
                    />
                    {!deactivateReason.trim() && (
                      <div className="invalid-feedback">Reason is required.</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowDeactivateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeactivateConfirm}
                    disabled={updateLoading || !deactivateReason.trim()}
                  >
                    {updateLoading ? "Updating..." : "Inactiva"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}