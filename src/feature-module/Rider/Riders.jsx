
import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";
import { Search } from "react-feather";

export default function Riders() {
  /* ===================== STATE ===================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(5);
  const [tableData, setTableData] = useState(CouponData);
  const [selectedRows, setSelectedRows] = useState([]);

  /* ===================== HANDLERS ===================== */

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item,
      ),
    );
  };

  /* ===================== COLUMNS ===================== */

  const handleBulkAction = (type) => {
    if (!selectedRows.length) return;

    if (type === "active") {
      setTableData((prev) =>
        prev.map((item) =>
          selectedRows.includes(item.id) ? { ...item, Status: true } : item,
        ),
      );
    }

    if (type === "inactive") {
      setTableData((prev) =>
        prev.map((item) =>
          selectedRows.includes(item.id) ? { ...item, Status: false } : item,
        ),
      );
    }
  };

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
    // {
    //   header: "ID",
    //   field: "id",
    // },
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
      header: "OTP",
      field: "otp",
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
      body: () => (
        <div className="edit-delete-action">
          <Link
            className="me-2 p-2"
            to="/viewrider"
            title="View Details"
            // data-bs-toggle="modal"
            // data-bs-target="#riderdetails-units"
          >
            <i className="ti ti-eye" />
          </Link>
          {/* <Link
            className="me-2 p-2"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-units"
          >
            <i className="ti ti-edit" />
          </Link>
          <Link
            className="p-2"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
          >
            <i className="ti ti-trash" />
          </Link> */}
        </div>
      ),
    },
  ];

  /* ===================== JSX ===================== */

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Riders</h4>
            </div>
          </div>

          <div className="card table-list-card">
            <div className="card-header d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Rows dropdown */}
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

                {/* Bulk Actions */}
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
                        className="dropdown-item"
                        onClick={() => handleBulkAction("active")}
                      >
                        Active
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item"
                        onClick={() => handleBulkAction("inactive")}
                      >
                        Inactive
                      </Link>
                    </li>
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

      <EditZones />
      <DeleteModal />
    </div>
  );
}
