import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";

export default function Driverdocument() {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status
        ? item.Status.charAt(0).toUpperCase() +
          item.Status.slice(1).toLowerCase()
        : "Pending",
    })),
  );

  /* ===================== ROW SELECTION ===================== */
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? visibleData.map((row) => row.id) : []);
  };

  /* ===================== STATUS ACTIONS ===================== */
  const approveDocument = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: "Approved" } : item,
      ),
    );
  };

  const rejectDocument = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: "Rejected" } : item,
      ),
    );
  };

  /* ===================== BULK MOVE TO TRASH ===================== */
  const handleBulkTrash = () => {
    if (!selectedRows.length) return;

    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: "Trash" } : item,
      ),
    );
    setSelectedRows([]);
  };

  /* ===================== FILTER DATA ===================== */
  const visibleData = tableData.filter((item) => item.Status !== "Trash");

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            visibleData.length > 0 && selectedRows.length === visibleData.length
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
      field: "expiredat",
    },
    {
      header: "Status",
      body: (row) => {
        let badgeClass = "bg-warning text-dark";
        if (row.Status === "Approved") badgeClass = "bg-success";
        if (row.Status === "Rejected") badgeClass = "bg-danger";

        return <span className={`badge ${badgeClass}`}>{row.Status}</span>;
      },
    },
    {
      header: "Created Date",
      body: (row) =>
        row?.date
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
            })
          : "--",
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="edit-delete-action d-flex align-items-center">
          {/* VIEW */}
          <Link className="me-2 p-2" to="/editdriverDocument" title="Edit">
            <i className="ti ti-edit" />
          </Link>

          <button
            className="me-2 "
            to="#"
            title="View"
            onClick={() => {
              setSelectedImage(row.documentImage); // 👈 your image field
              setShowImageModal(true);
            }}
          >
            <i className="ti ti-eye" />
          </button>

          {/* APPROVE */}
          <button
            className="btn p-2 text-success"
            title="Approve"
            onClick={() => approveDocument(row.id)}
            disabled={row.Status === "Approved"}
          >
            <i className="ti ti-check" />
          </button>

          {/* REJECT */}
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
              {/* Rows */}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {rows}
                </Link>
                <ul className="dropdown-menu">
                  {[5, 10, 15, 20, 25].map((num) => (
                    <li key={num}>
                      <Link
                        to="#"
                        className="dropdown-item"
                        onClick={() => setRows(num)}
                      >
                        {num}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bulk */}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Bulk Actions
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item text-danger"
                      onClick={handleBulkTrash}
                    >
                      <i className="ti ti-trash me-2" />
                      Move to Trash
                    </Link>
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

              {showImageModal && (
                <div className="modal d-block" tabIndex="-1">
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
                          src={selectedImage}
                          alt="Document"
                          className="img-fluid rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <SearchFromApi rows={rows} setRows={setRows} />
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <PrimeDataTable
                column={columns}
                data={visibleData}
                totalRecords={visibleData.length}
                rows={rows}
              />
            </div>
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
}
