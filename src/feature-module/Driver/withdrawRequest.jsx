
import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";


export default function WithdrawRequest() {
  /* ===================== STATE ===================== */

  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(10);

  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status
        ? item.Status.charAt(0).toUpperCase() +
          item.Status.slice(1).toLowerCase()
        : "Pending",
    }))
  );

  const [selectedRows, setSelectedRows] = useState([]);

  /* ===================== HANDLERS ===================== */

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  /* ===================== APPROVE / REJECT ===================== */

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

  /* ===================== COLUMNS ===================== */

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            tableData.length > 0 && selectedRows.length === tableData.length
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
      header: "Driver",
      field: "driver",
    },
    {
      header: "Amount",
      field: "amount",
    },
    {
      header: "Status",
      body: (row) => {
        let badgeClass = "bg-warning text-dark";
        if (row.Status === "Approved") badgeClass = "bg-success";
        if (row.Status === "Rejected") badgeClass = "bg-danger";

        return (
          <span className={`badge ${badgeClass}`}>
            {row.Status}
          </span>
        );
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
          <Link className="me-2 p-2" to="#" title="View">
            <i className="ti ti-eye" />
          </Link>

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
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title">
              <h4>Withdraw Requests</h4>
            </div>
            <Link to="/export" className="btn btn-outline-success"><i className="ti ti-download me-2" />Export</Link>
          </div>

          {/* Table Card */}
          <div className="card table-list-card">
            <div className="card-header d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2 flex-wrap">
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
                <button className="btn btn-outline-success">Apply</button>
              </div>

              <SearchFromApi
                callback={handleSearch}
                rows={rows}
                setRows={setRows}
              />
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={tableData}
                  totalRecords={tableData.length}
                  rows={rows}
                />
              </div>
            </div>
          </div>
        </div>

        <CommonFooter />
      </div>
    </div>
  );
}
