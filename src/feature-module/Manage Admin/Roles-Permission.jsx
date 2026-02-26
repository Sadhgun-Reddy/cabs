import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/coupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";

export default function RolePermission() {
  const [_searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status ?? true,
    }))
  );

  /* ===================== HANDLERS ===================== */

  const handleSearch = (value) => setSearchQuery(value);

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item
      )
    );
  };

    /* ===================== ROW SELECTION ===================== */

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

    /* ===================== BULK ACTIONS ===================== */

  const handleBulkStatus = (status) => {
    if (!selectedRows.length) return;

    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, Status: status }
          : item
      )
    );
    setSelectedRows([]);
  };

  const dataSource = CouponData;

   /* ===================== COLUMNS ===================== */

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            tableData.length > 0 &&
            selectedRows.length === tableData.length
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
      header: "Name",
      field: "Name",
    },
    {
      header: "Status",
      body: (row) => (
        <div className="form-check form-switch">
          <input
          type="checkbox"
          className={`form-check-input ${
              row.Status ? "bg-success" : "bg-danger"
            }`}
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
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              // hour: "2-digit",
            })
          : "--",
    },
    {
      header: "Actions",
      body: () => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="/Edit-Role"
              title="Edit Zone"

            >
              <i className="ti ti-edit text-primary" />
            </Link>
            <Link
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
              className="p-2"
              to="#"
              title="Delete"
            >
              <i className="ti ti-trash text-danger" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Role & Permission</h4>
              </div>
            </div>
             <Link to="/Add-Role" className="btn btn-primary">
              <i className="ti ti-circle-plus me-1" />Add New</Link>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
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

              <div className="dropdown me-2">
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
                      onClick={() => handleBulkStatus(false)}
                    >
                      Delete Permanently
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
                  data={dataSource}
                  totalRecords={5}
                  rows={10}
                  setRows={() => {}}
                  currentPage={2}
                  setCurrentPage={() => {}}
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
