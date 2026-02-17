import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";

export default function StartedRides() {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status ?? true,
    })),
  );

  /* ===================== HANDLERS ===================== */

  const handleSearch = (value) => setSearchQuery(value);

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item,
      ),
    );
  };

  /* ===================== ROW SELECTION ===================== */

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
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
        selectedRows.includes(item.id) ? { ...item, Status: status } : item,
      ),
    );
    setSelectedRows([]);
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
      header: "Ride Number",
      field: "ridenumber",
    },
    {
      header: "Rider",
      field: "rider",
    },
    {
      header: "Driver",
      field: "driver",
    },
    {
      header: "Service",
      field: "service",
    },
    {
      header: "Service Category",
      field: "servicecategory",
    },
    {
      header: "Payment Status",
      field: "paymentstatus",
    },
    {
      header: "Ride Status",
      field: "rideStatus",
      
    },
    {
      header: "Total",
      field: "total",
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
        <div className="view-action">
          <Link className="me-2 p-2" to="#" title="Ride Details">
            <i className="ti ti-eye" />
          </Link>
        </div>
      ),
    },
  ];

  /* ===================== JSX ===================== */

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between">
          <div>
            <h4>Started Rides</h4>
          </div>
          <Link to="/export" className="btn btn-outline-success">
            <i className="ti ti-download me-2" />
            Export
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {/* Rows Dropdown */}
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

              <button
                className="btn btn-outline-success"
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
            <PrimeDataTable
              column={columns}
              data={tableData}
              totalRecords={tableData.length}
              rows={rows}
            />
          </div>
        </div>
      </div>

      <CommonFooter />
      <EditZones />
      <DeleteModal />
    </div>
  );
}
