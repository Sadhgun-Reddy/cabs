import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom"; 
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

// 👇 IMPORTANT: Replace with your actual backend base URL
const BASE_URL = "http://88.222.213.67:5090/";  // adjust if needed

export default function Driverdocument() {
  const location = useLocation();
  const { driverId, driverName } = location.state || {};

  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Bulk action type
  const [bulkAction, setBulkAction] = useState("trash");

  // Multi‑image modal
  const [showDriverDocumentsModal, setShowDriverDocumentsModal] = useState(false);
  const [selectedDriverDocuments, setSelectedDriverDocuments] = useState([]);
  const [selectedDriverName, setSelectedDriverName] = useState("");

  const documentTypes = [
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

  /* ===================== HANDLERS ===================== */
  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter(
      (item) =>
        item.driver?.toLowerCase().includes(query) ||
        item.document?.toLowerCase().includes(query)
    );
  }, [tableData, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rows;
    return filteredData.slice(start, start + rows);
  }, [filteredData, page, rows]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
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

  const approveDocument = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: "Approved" } : item
      )
    );
  };

  const rejectDocument = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: "Rejected" } : item
      )
    );
  };

  const handleBulkTrash = () => {
    if (!selectedRows.length) return;
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: "Trash" } : item
      )
    );
    setSelectedRows([]);
    setSelectionVersion((v) => v + 1);
  };

  const handleBulkApprove = () => {
    if (!selectedRows.length) return;
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: "Approved" } : item
      )
    );
    setSelectedRows([]);
    setSelectionVersion((v) => v + 1);
  };

  const handleBulkReject = () => {
    if (!selectedRows.length) return;
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: "Rejected" } : item
      )
    );
    setSelectedRows([]);
    setSelectionVersion((v) => v + 1);
  };

  /* ===================== FETCH DATA ===================== */
  const fetchDocuments = async () => {
    setLoading(true);
    setError("");

    const url = driverId ? URLS.GetDriverDocumentById : URLS.GetDriverDocument;
    const body = driverId ? JSON.stringify({ driverId }) : "{}";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        let rows = [];
        if (driverId) {
          const driver = data.data;
          documentTypes.forEach((doc) => {
            const imageUrl = driver[doc.field];
            if (imageUrl && imageUrl.trim() !== "") {
              // 🔧 FIX: Prepend BASE_URL if the path is relative
              const fullImageUrl = imageUrl.startsWith("http")
                ? imageUrl
                : BASE_URL + imageUrl;

              console.log("Image URL:", fullImageUrl); 

              rows.push({
                id: `${driver.driverId}_${doc.field}`,
                document: doc.label,
                driver: driver.driverName,
                documentImage: fullImageUrl,
                Status: "Pending",
                date: driver.logCreatedDate,
              });
            }
          });
        } else {
          if (Array.isArray(data.data)) {
            data.data.forEach((driver) => {
              documentTypes.forEach((doc) => {
                const imageUrl = driver[doc.field];
                if (imageUrl && imageUrl.trim() !== "") {
                  const fullImageUrl = imageUrl.startsWith("http")
                    ? imageUrl
                    : BASE_URL + imageUrl;

                  console.log("Image URL:", fullImageUrl); 

                  rows.push({
                    id: `${driver.driverId}_${doc.field}`,
                    document: doc.label,
                    driver: driver.driverName,
                    documentImage: fullImageUrl,
                    Status: "Pending",
                    date: driver.logCreatedDate,
                  });
                }
              });
            });
          }
        }
        setTableData(rows);
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
  }, [driverId]);

  /* ===================== COLUMNS ===================== */
  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            style={{ accentColor: "#0d6efd" }}
            checked={allVisibleSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        body: (row) => (
          <input
            type="checkbox"
            style={{ accentColor: "#0d6efd" }}
            checked={selectedRows.includes(row.id)}
            onChange={() => handleRowSelect(row.id)}
          />
        ),
      },
      {
        header: "Sl.No",
        body: (_row, options) => options.rowIndex + 1 + (page - 1) * rows,
      },
      {
        header: "Document",
        field: "document",
      },
      {
        header: "Driver",
        field: "driver",
      },
      {
        header: "Expired At",
        body: () => "--",
      },
      {
        header: "Status",
        body: (row) => {
          let badgeClass = "bg-warning text-dark";
          if (row.Status === "Approved") badgeClass = "bg-success";
          if (row.Status === "Rejected") badgeClass = "bg-danger";
          if (row.Status === "Trash") badgeClass = "bg-secondary";
          return <span className={`badge ${badgeClass}`}>{row.Status}</span>;
        },
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
          <div className="edit-delete-action d-flex align-items-center">
            {!driverId && (
              <button
                className="btn p-2"
                title="View All Documents"
                onClick={() => {
                  const driverIdFromRow = row.id.split("_")[0];
                  const driverDocs = tableData.filter((item) =>
                    item.id.startsWith(driverIdFromRow)
                  );
                  setSelectedDriverDocuments(driverDocs);
                  setSelectedDriverName(row.driver);
                  setShowDriverDocumentsModal(true);
                }}
              >
                <i className="ti ti-eye text-primary" />
              </button>
            )}
            <button
              className="btn p-2 text-success"
              title="Approve"
              onClick={() => approveDocument(row.id)}
              disabled={row.Status === "Approved"}
            >
              <i className="ti ti-check" />
            </button>
            <button
              className="btn p-2 text-danger"
              title="Reject"
              onClick={() => rejectDocument(row.id)}
              disabled={row.Status === "Rejected"}
            >
              <i className="ti ti-x" />
            </button>
          </div>
        ),
      },
    ],
    [selectedRows, filteredData, allVisibleSelected, page, rows, driverId, tableData]
  );

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>{driverName ? `Documents of ${driverName}` : "Drivers Documents"}</h4>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {/* rows dropdown */}
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

              {/* bulk actions dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-white dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  Bulk Actions
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={handleBulkApprove}>
                      Approve
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleBulkReject}>
                      Reject
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleBulkTrash}>
                      Move to Trash
                    </button>
                  </li>
                </ul>
              </div>
              <button className="btn btn-outline-success">Apply</button>
            </div>
            <SearchFromApi callback={handleSearch} rows={rows} setRows={setRows} />
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
                  key={selectionVersion}
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

      {/* Multi‑image Modal */}
      {showDriverDocumentsModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Documents of {selectedDriverName}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDriverDocumentsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {selectedDriverDocuments.map((doc) => (
                    <div key={doc.id} className="col-md-4 mb-3">
                      <div className="card">
                        <img
                          src={doc.documentImage}
                          alt={doc.document}
                          className="card-img-top"
                          style={{ height: "150px", objectFit: "cover" }}
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                        <div className="card-body p-2">
                          <p className="card-text text-center">{doc.document}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDriverDocumentsModal(false)}
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