import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";
import axios from "axios";

export default function Zones() {
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");

  // Handlers
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    return tableData.filter((item) =>
      item.Name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tableData, searchQuery]);

  // Helper: convert boolean status to API string
  const boolToStatus = (bool) => (bool ? "active" : "inactive");

  // API call to update status
  const updateZoneStatus = async (ids, newStatus) => {
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        URLS.UpdateZoneStatus,
        {
          ids,
          status: boolToStatus(newStatus),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchZones();
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Individual toggle
  const toggleStatus = (id) => {
    const item = tableData.find((item) => item.id === id);
    if (!item) return;
    const newStatus = !item.Status;
    updateZoneStatus([id], newStatus);
  };

  // Bulk actions
  const handleBulkStatus = (status) => {
    if (!selectedRows.length) return;
    updateZoneStatus(selectedRows, status);
    setSelectedRows([]);
    setSelectionVersion((v) => v + 1);
  };

  // Row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    setSelectionVersion((v) => v + 1);
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? filteredData.map((row) => row.id) : []);
    setSelectionVersion((v) => v + 1);
  };

  // Compute if all visible rows are selected
  const allVisibleSelected =
    filteredData.length > 0 &&
    selectedRows.length === filteredData.length &&
    filteredData.every((row) => selectedRows.includes(row.id));

  // Columns definition (memoized with dependencies)
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
        body: (_row, options) => options.rowIndex + 1 + (currentPage - 1) * rows,
      },
      {
        header: "Name",
        field: "Name",
      },
      {
        header: "Priority",
        field: "priority",
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
              disabled={updateLoading}
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
              })
            : "--",
      },
      {
        header: "Actions",
        body: (row) => (
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to={`/editZones/${row.id}`}>
              <i className="ti ti-edit text-primary" />
            </Link>
          </div>
        ),
      },
    ],
    [selectedRows, filteredData, allVisibleSelected, currentPage, rows, updateLoading]
  );

  // Fetch zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetAllZones,
        { zoneType: "normal" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const zones = res.data?.zones || [];
      const formattedData = zones.map((zone) => ({
        id: zone._id,
        Name: zone.name,
        priority: zone.priority,
        Status: zone.status === "active",
        date: zone.logCreatedDate,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between">
          <h4>Zones</h4>
          <Link to="/Addzones" className="btn btn-primary">
            <i className="ti ti-circle-plus me-1" /> Add Zones
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
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

              {/* Bulk actions */}
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
                      className="dropdown-item text-success"
                      onClick={() => handleBulkStatus(true)}
                    >
                      Active
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item text-danger"
                      onClick={() => handleBulkStatus(false)}
                    >
                      Inactive
                    </Link>
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
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <PrimeDataTable
                key={selectionVersion}
                column={columns}
                data={filteredData}
                totalRecords={filteredData.length}
                rows={rows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
}