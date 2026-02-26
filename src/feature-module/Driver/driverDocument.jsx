import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

const BASE_URL = "http://88.222.213.67:5090/";

export default function Driverdocument() {
  const location = useLocation();

  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Document modal
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDriverDocs, setSelectedDriverDocs] = useState([]);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [modalLoading, setModalLoading] = useState(false);

  // Approve / Reject
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  const documentTypes = [
    { label: "Driver Image", field: "driverImage" },
    { label: "Aadhar Front", field: "adharCardFront" },
    { label: "Aadhar Back", field: "adharCardBack" },
    { label: "Driving Licence Front", field: "drivingLicenceFront" },
    { label: "Driving Licence Back", field: "drivingLicenceBack" },
    { label: "Vehicle RC", field: "vehicleRC" },
    { label: "Vehicle Insurance", field: "vehicleInsurance" },
    { label: "Vehicle Pollution", field: "vehiclePollution" },
    { label: "Vehicle Fitness", field: "vehicleFitness" },
    { label: "Policy Verify", field: "policyVerify" },
    { label: "Quarterly Tax", field: "quarterlyTax" },
  ];

  /* ===================== HELPERS ===================== */
  const buildImageUrl = (path) => {
    if (!path || !path.trim()) return null;
    return path.startsWith("http") ? path : BASE_URL + path;
  };

  const getDriverDocuments = (driver) => {
    const docs = [];
    documentTypes.forEach((docType) => {
      const url = buildImageUrl(driver[docType.field]);
      if (url) {
        docs.push({
          key: `${driver.driverId}_${docType.field}`,
          label: docType.label,
          url,
        });
      }
    });
    if (Array.isArray(driver.vehicleImages)) {
      driver.vehicleImages.forEach((img, idx) => {
        const url = buildImageUrl(img);
        if (url) {
          docs.push({
            key: `${driver.driverId}_vehicleImage_${idx}`,
            label: `Vehicle Image ${idx + 1}`,
            url,
          });
        }
      });
    }
    return docs;
  };

  /* ===================== HANDLERS ===================== */
  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter((item) =>
      item.driverName?.toLowerCase().includes(query)
    );
  }, [tableData, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rows;
    return filteredData.slice(start, start + rows);
  }, [filteredData, page, rows]);

  /* ===================== MODAL OPEN / CLOSE ===================== */
  const openDocumentsModal = async (driver) => {
    setSelectedDriver(driver);
    setActiveDocIndex(0);
    setShowRejectInput(false);
    setRejectReason("");
    setActionMessage({ type: "", text: "" });
    setShowDocumentsModal(true);
    setModalLoading(true);

    try {
      const response = await fetch(URLS.GetDriverDocumentById, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ driverId: driver.driverId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        const docs = getDriverDocuments(data.data);
        setSelectedDriverDocs(docs);
        setSelectedDriver(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch driver documents");
      }
    } catch (err) {
      console.error("Fetch driver docs error:", err);
      setSelectedDriverDocs([]);
      setActionMessage({ type: "danger", text: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const closeDocumentsModal = () => {
    setShowDocumentsModal(false);
    setSelectedDriver(null);
    setSelectedDriverDocs([]);
    setActiveDocIndex(0);
    setShowRejectInput(false);
    setRejectReason("");
    setActionMessage({ type: "", text: "" });
  };

  /* ===================== KYC APPROVE / REJECT ===================== */
  const handleApproveKyc = async () => {
    if (!selectedDriver) return;
    setActionLoading(true);
    setActionMessage({ type: "", text: "" });

    try {
      const response = await fetch(URLS.UpdateDriverKycStatus, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: selectedDriver.driverId,
          kycStatus: "verified",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setActionMessage({
          type: "success",
          text: `KYC for ${selectedDriver.driverName} has been approved successfully!`,
        });
        // Refresh the table data
        fetchDocuments();
        // Close modal
        closeDocumentsModal();
      } else {
        throw new Error(data.message || "Failed to approve KYC");
      }
    } catch (err) {
      console.error("Approve KYC error:", err);
      setActionMessage({ type: "danger", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectKyc = async () => {
    if (!selectedDriver) return;
    if (!rejectReason.trim()) {
      setActionMessage({
        type: "warning",
        text: "Please provide a reason for rejection.",
      });
      return;
    }

    setActionLoading(true);
    setActionMessage({ type: "", text: "" });

    try {
      const response = await fetch(URLS.UpdateDriverKycStatus, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: selectedDriver.driverId,
          kycStatus: "rejected",
          kycRejectedReason: rejectReason.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setActionMessage({
          type: "success",
          text: `KYC for ${selectedDriver.driverName} has been rejected.`,
        });
        setShowRejectInput(false);
        setRejectReason("");
        // Refresh the table data
        fetchDocuments();
        // Close modal
        closeDocumentsModal();
      } else {
        throw new Error(data.message || "Failed to reject KYC");
      }
    } catch (err) {
      console.error("Reject KYC error:", err);
      setActionMessage({ type: "danger", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  /* ===================== FETCH DATA ===================== */
  const fetchDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(URLS.GetDriverDocument, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: "{}",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setTableData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch documents");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /* ===================== MODAL DOCS ===================== */
  const activeDoc = selectedDriverDocs[activeDocIndex] || null;
  const isLastDoc = activeDocIndex === selectedDriverDocs.length - 1;

  /* ===================== COLUMNS ===================== */
  const columns = useMemo(
    () => [
      {
        header: "Sl.No",
        body: (_row, options) => options.rowIndex + 1 + (page - 1) * rows,
      },
      {
        header: "Driver Name",
        body: (row) => (
          <div className="d-flex align-items-center gap-2">
            {row.driverImage && (
              <img
                src={buildImageUrl(row.driverImage)}
                alt={row.driverName}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/36?text=No";
                }}
              />
            )}
            <span className="fw-semibold">{row.driverName}</span>
          </div>
        ),
      },
      {
        header: "Total Documents",
        body: (row) => {
          const count = getDriverDocuments(row).length;
          return <span className="badge bg-info">{count}</span>;
        },
      },
      {
        header: "Created Date",
        body: (row) =>
          row?.logCreatedDate
            ? new Date(row.logCreatedDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            : "--",
      },
      {
        header: "Actions",
        body: (row) => (
          <button
            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
            onClick={() => openDocumentsModal(row)}
          >
            <i className="ti ti-eye" />
            View Documents
          </button>
        ),
      },
    ],
    [page, rows]
  );

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Drivers Documents</h4>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
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
                        onClick={() => {
                          setRows(num);
                          setPage(1);
                        }}
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
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={paginatedData}
                  totalRecords={filteredData.length}
                  rows={rows}
                  onPage={(e) => setPage(e.page + 1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ DOCUMENTS MODAL ============ */}
      {showDocumentsModal && selectedDriver && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDocumentsModal();
          }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            style={{ maxWidth: "750px" }}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="ti ti-file-text me-2" />
                  Documents of {selectedDriver.driverName}
                </h5>

              </div>

              {/* Body */}
              <div className="modal-body p-0">
                {/* Loading */}
                {modalLoading && (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading documents...</p>
                  </div>
                )}

                {/* No docs */}
                {!modalLoading && selectedDriverDocs.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <i
                      className="ti ti-file-off"
                      style={{ fontSize: "3rem" }}
                    />
                    <p className="mt-2">No documents found</p>
                  </div>
                )}

                {/* Documents viewer */}
                {!modalLoading && selectedDriverDocs.length > 0 && (
                  <>
                    {/* Stepper Tabs */}
                    <div
                      className="d-flex flex-wrap gap-1 p-3 border-bottom"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      {selectedDriverDocs.map((doc, idx) => {
                        let btnClass = "btn-outline-secondary";
                        if (idx === activeDocIndex) btnClass = "btn-primary";
                        else if (idx < activeDocIndex)
                          btnClass = "btn-outline-primary";

                        return (
                          <button
                            key={doc.key}
                            className={`btn btn-sm ${btnClass}`}
                            onClick={() => setActiveDocIndex(idx)}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {idx < activeDocIndex && (
                              <i className="ti ti-check me-1" />
                            )}
                            {doc.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Document Display */}
                    {activeDoc && (
                      <div className="p-4">
                        <div className="text-center mb-3">
                          <h6 className="text-muted mb-1">
                            Document {activeDocIndex + 1} of{" "}
                            {selectedDriverDocs.length}
                          </h6>
                          <h5>{activeDoc.label}</h5>
                        </div>

                        {/* Image */}
                        <div
                          className="text-center mb-3"
                          style={{
                            border: "1px solid #dee2e6",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <img
                            src={activeDoc.url}
                            alt={activeDoc.label}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "400px",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Image+Not+Found";
                            }}
                          />
                        </div>

                        {/* Prev / Next Navigation */}
                        <div className="d-flex justify-content-between mt-4">
                          <button
                            className="btn btn-outline-primary"
                            disabled={activeDocIndex === 0}
                            onClick={() =>
                              setActiveDocIndex((prev) => prev - 1)
                            }
                          >
                            <i className="ti ti-chevron-left me-1" />
                            Previous
                          </button>
                          {!isLastDoc && (
                            <button
                              className="btn btn-outline-primary"
                              onClick={() =>
                                setActiveDocIndex((prev) => prev + 1)
                              }
                            >
                              Next
                              <i className="ti ti-chevron-right ms-1" />
                            </button>
                          )}
                        </div>

                        {/* ===== APPROVE / REJECT SECTION (only on last doc) ===== */}
                        {isLastDoc && (
                          <div className="mt-4 pt-4 border-top">
                            <div className="text-center mb-3">
                              <h6 className="fw-bold">
                                You have reviewed all {selectedDriverDocs.length}{" "}
                                document(s).
                              </h6>
                              <p className="text-muted mb-0">
                                Please approve or reject the KYC for{" "}
                                <strong>{selectedDriver.driverName}</strong>.
                              </p>
                            </div>

                            {/* Action message */}
                            {actionMessage.text && (
                              <div
                                className={`alert alert-${actionMessage.type} text-center`}
                                role="alert"
                              >
                                {actionMessage.text}
                              </div>
                            )}

                            {/* Reject reason input */}
                            {showRejectInput && (
                              <div className="mb-3">
                                <label className="form-label fw-semibold">
                                  Rejection Reason{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <textarea
                                  className="form-control"
                                  rows="3"
                                  placeholder="Enter the reason for rejecting the KYC..."
                                  value={rejectReason}
                                  onChange={(e) =>
                                    setRejectReason(e.target.value)
                                  }
                                />
                              </div>
                            )}

                            {/* Buttons */}
                            <div className="d-flex justify-content-center gap-3">
                              {!showRejectInput ? (
                                <>
                                  <button
                                    className="btn btn-success d-flex align-items-center gap-1 px-4"
                                    onClick={handleApproveKyc}
                                    disabled={actionLoading}
                                  >
                                    {actionLoading ? (
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                      />
                                    ) : (
                                      <i className="ti ti-check" />
                                    )}
                                    Approve KYC
                                  </button>
                                  <button
                                    className="btn btn-danger d-flex align-items-center gap-1 px-4"
                                    onClick={() => {
                                      setShowRejectInput(true);
                                      setActionMessage({
                                        type: "",
                                        text: "",
                                      });
                                    }}
                                    disabled={actionLoading}
                                  >
                                    <i className="ti ti-x" />
                                    Reject KYC
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-danger d-flex align-items-center gap-1 px-4"
                                    onClick={handleRejectKyc}
                                    disabled={
                                      actionLoading ||
                                      !rejectReason.trim()
                                    }
                                  >
                                    {actionLoading ? (
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                      />
                                    ) : (
                                      <i className="ti ti-x" />
                                    )}
                                    Confirm Reject
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary d-flex align-items-center gap-1 px-4"
                                    onClick={() => {
                                      setShowRejectInput(false);
                                      setRejectReason("");
                                      setActionMessage({
                                        type: "",
                                        text: "",
                                      });
                                    }}
                                    disabled={actionLoading}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeDocumentsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CommonFooter />
    </div>
  );
}