import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function DriverRules() {
  /* ===================== STATE ===================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(5);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===================== HANDLERS ===================== */
  const handleSearch = (value) => setSearchQuery(value);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter((item) => item.Name?.toLowerCase().includes(query));
  }, [tableData, searchQuery]);

  // Toggle single row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Select/deselect all visible rows
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows((prev) => {
        const visibleIds = filteredData.map((row) => row.id);
        return [...new Set([...prev, ...visibleIds])];
      });
    } else {
      setSelectedRows((prev) =>
        prev.filter((id) => !filteredData.some((row) => row.id === id))
      );
    }
  };

  // Check if all visible rows are selected
  const allVisibleSelected =
    filteredData.length > 0 &&
    filteredData.every((row) => selectedRows.includes(row.id));

  // Bulk status update
  const handleBulkAction = (type) => {
    if (!selectedRows.length) return;
    const newStatus = type === "active";
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: newStatus } : item
      )
    );
  };

  // Toggle individual status
  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item
      )
    );
  };

  /* ===================== FETCH DATA ===================== */
  const fetchDriverRules = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        URLS.GetAllDriverRules,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const driverRules = response.data?.data || [];
      const formattedData = driverRules.map((item) => ({
        id: item._id,
        Name: item.name,
        vechiclegroup: item.vehicleGroupName,
        priority: item.priority,
        Status: item.status === "active",
        date: item.logCreatedDate,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch driver rules"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverRules();
  }, []);

  /* ===================== COLUMNS (memoized) ===================== */
  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            style={{ accentColor: '#0d6efd' }} // Primary color
            checked={allVisibleSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        body: (row) => (
          <input
            type="checkbox"
            style={{ accentColor: '#0d6efd' }} // Primary color
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
        header: "Title",
        field: "Name",
      },
      // {
      //   header: "Vehicle Group",
      //   field: "vechiclegroup",
      // },
      {
        header: "Priority",
        field: "priority",
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
              to={`/editdriverRules/${row.id}`}
              state={{ driverRule: row }}
              title="Edit Rule"
            >
              <i className="ti ti-edit text-primary" />
            </Link>
            <Link className="p-2 text-danger" to="#" onClick={() => {}}>
              <i className="ti ti-trash text-danger" />
            </Link>
          </div>
        ),
      },
    ],
    [selectedRows, filteredData, allVisibleSelected]
  );

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Drivers Rules</h4>
          </div>
          <Link to="/Add-Driver-Rules" className="btn btn-primary">
            <i className="ti ti-circle-plus me-1" /> Add Driver Rule
          </Link>
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
                      className="dropdown-item"
                      onClick={() => handleBulkAction("active")}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleBulkAction("inactive")}
                    >
                      Inactive
                    </button>
                  </li>
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
                  key={selectedRows.length}
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
      <CommonFooter />
    </div>
  );
}