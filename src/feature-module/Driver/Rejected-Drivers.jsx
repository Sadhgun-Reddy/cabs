import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function RejectedDriver() {
  const navigate = useNavigate();

  /* ===================== STATE ===================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    return tableData.filter((item) =>
      item.Name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tableData, searchQuery]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item
      )
    );
  };

  const handleBulkAction = (type) => {
    if (!selectedRows.length) return;
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, Status: type === "active" }
          : item
      )
    );
  };

  // Navigate to documents page
  const goToDriverDocuments = (driverId, driverName) => {
    navigate("/driverDocument", { state: { driverId, driverName } });
  };

  /* ===================== FETCH DRIVERS ===================== */
  const fetchDrivers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(URLS.GetAllDrivers, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          kycStatus: "rejected",
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.user)) {
        const formattedData = data.user.map((user) => ({
          id: user.driverId,
          Name: user.name || user.phone,
          Email: user.email,
          Status: user.status === "active",
          date: user.logCreatedDate,
        }));
        setTableData(formattedData);
      } else {
        throw new Error(data.message || "Invalid response format");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Name",
      field: "Name",
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
            title="View"
          >
            <i className="ti ti-eye text-primary" />
          </Link>
          {/* <Link
            className="me-2 p-2"
            to="/editdriver"
            title="Edit"
          >
            <i className="ti ti-edit text-primary" />
          </Link>
          <Link
            className="p-2"
            to="#"
            title="Delete"
          >
            <i className="ti ti-trash text-danger" />
          </Link> */}
          {/* Document icon with navigation */}
          <button
            className="btn p-2"
            title="Files"
            onClick={() => goToDriverDocuments(row.id, row.Name)}
          >
            <i className="ti ti-file" />
          </button>
        </div>
      ),
    },
  ];

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Rejected Drivers</h4>
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
              <button className="btn btn-outline-success">Apply</button>
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
      <CommonFooter />
    </div>
  );
}