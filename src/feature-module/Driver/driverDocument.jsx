import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url"; // adjust path to your URL config

export default function Driverdocument() {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Define document types and their corresponding field names in API response
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
  };

  // Filter data based on search query (by driver name or document type)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter(
      (item) =>
        item.driver?.toLowerCase().includes(query) ||
        item.document?.toLowerCase().includes(query),
    );
  }, [tableData, searchQuery]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? filteredData.map((row) => row.id) : []);
  };

  // Approve document (update status locally)
  const approveDocument = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: "Approved" } : item,
      ),
    );
    // TODO: Call API to persist approval
  };

  // Reject document (update status locally)
  const rejectDocument = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: "Rejected" } : item,
      ),
    );
    // TODO: Call API to persist rejection
  };

  // Bulk move to trash (set status to "Trash")
  const handleBulkTrash = () => {
    if (!selectedRows.length) return;
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: "Trash" } : item,
      ),
    );
    setSelectedRows([]);
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
  
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const rows = [];
        data.data.forEach((driver) => {
          documentTypes.forEach((doc) => {
            const imageUrl = driver[doc.field];

            if (imageUrl && imageUrl.trim() !== "") {
              rows.push({
                id: `${driver.driverId}_${doc.field}`,
                document: doc.label,
                driver: driver.driverName,
                documentImage: imageUrl,
                Status: "Pending",
                date: driver.logCreatedDate,
              });
            }
          });
        });
        setTableData(rows);
      } else {
        throw new Error(data.message || "Invalid response format");
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

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            filteredData.length > 0 &&
            selectedRows.length === filteredData.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      body: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
        />
      ),
    },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
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
      body: () => "--", // Placeholder; add expiry field when available
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
          {/* View Image */}
          <button
            className="btn p-2"
            title="View"
            onClick={() => {
              setSelectedImage(row.documentImage);
              setShowImageModal(true);
            }}
          >
            <i className="ti ti-eye" />
          </button>

          {/* Edit (optional) */}
          <Link className="p-2" to="/edit-document" title="Edit">
            <i className="ti ti-edit" />
          </Link>

          {/* Approve */}
          <button
            className="btn p-2 text-success"
            title="Approve"
            onClick={() => approveDocument(row.id)}
            disabled={row.Status === "Approved"}
          >
            <i className="ti ti-check" />
          </button>

          {/* Reject */}
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
  ];

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Drivers Documents</h4>
          <Link to="/addDocument" className="btn btn-outline-success">
            <i className="ti ti-circle-plus me-1" /> Add Document
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
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

              {/* Bulk Actions */}
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
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleBulkTrash}
                    >
                      <i className="ti ti-trash me-2" />
                      Move to Trash
                    </button>
                  </li>
                </ul>
              </div>

              <button
                className="btn btn-outline-success"
                onClick={handleBulkTrash}
                disabled={!selectedRows.length}
              >
                Apply
              </button>
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
                  column={columns}
                  data={filteredData}
                  totalRecords={filteredData.length}
                  rows={rows}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={`http://88.222.213.67:5090/${selectedImage}`} // adjust base URL if needed
                  alt="Document"
                  className="img-fluid rounded"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png"; // fallback
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <CommonFooter />
    </div>
  );
}
