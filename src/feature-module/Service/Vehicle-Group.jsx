import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { debounce } from "../../utils/debounce";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function VehicleGroups() {
  // STATE
  const [rows, setRows] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounced search
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    []
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    debouncedSetSearchTerm(value);
  };

  // Individual status toggle 
  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item
      )
    );
  };

  // ROW SELECTION
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  // BULK STATUS UPDATE API
  const handleBulkStatus = async (status) => {
    if (!selectedRows.length) return;

    setBulkLoading(true);
    setError("");

    try {
      const payload = {
        ids: selectedRows,
        status: status ? "active" : "inactive",
      };

      await axios.put(URLS.UpdateVehicleGroupStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Refresh list with current search term
      await fetchVehicleGroups(searchTerm);
      setSelectedRows([]);
    } catch (err) {
      console.error("Bulk update error:", err);
      setError("Failed to update status for selected items");
    } finally {
      setBulkLoading(false);
    }
  };

  // FETCH VEHICLE GROUPS FROM API 
  const fetchVehicleGroups = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      // Build URL with search query if provided
      const url = search
        ? `${URLS.GetAllVehicleGroup}?searchQuery=${encodeURIComponent(search)}`
        : URLS.GetAllVehicleGroup;

      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Adjust based on actual API response structure
      const groups = res.data?.groups || res.data?.data || [];
      const formattedData = groups.map((group) => ({
        id: group._id,
        name: group.name,
        description: group.description,
        downgrade: group.downGrade,
        priority: group.priority,
        Status: group.status === "active",
        date: group.logCreatedDate || group.createdAt,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch vehicle groups");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when searchTerm changes
  useEffect(() => {
    fetchVehicleGroups(searchTerm);
  }, [searchTerm]);

  // Initial fetch
  useEffect(() => {
    fetchVehicleGroups();
  }, []);

  // COLUMNS
  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            tableData.length > 0 && selectedRows.length === tableData.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
          disabled={loading || bulkLoading}
        />
      ),
      body: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
          disabled={loading || bulkLoading}
        />
      ),
    },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Group Name",
      field: "name",
    },
    {
      header: "Priority",
      field: "priority",
    },
    {
      header: "Down Grade",
      field: "downgrade",
    },
    {
      header: "Description",
      field: "description",
    },
    {
      header: "Status",
      body: (row) => (
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className={`form-check-input ${row.Status ? "bg-success" : "bg-danger"
              }`}
            checked={row.Status}
            onChange={() => toggleStatus(row.id)}
            disabled={loading || bulkLoading}
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
            // minute: "2-digit",
          })
          : "--",
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="edit-price-zone-action">
          <Link
            className="me-2 p-2"
            to={`/EditVehicleGroup/${row.id}`}
            title="Edit"
          >
            <i className="ti ti-edit" />
          </Link>
          <Link
            to="/vehiclesurgeprice"
            className="me-2 p-2 text-muted"
            title="Surge Price"
          >
            <i className="ti ti-trending-up" />
          </Link>
          <Link
            to="/vehicleZone"
            className="me-2 p-2 text-muted"
            title="Vehicle Zone"
          >
            <i className="ti ti-car" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between">
          <div>
            <h4>Vehicle Group</h4>
          </div>
          <Link to="/addvehicleGroup" className="btn btn-outline-success">
            <i className="ti ti-circle-plus me-1" />
            Add New Vehicle
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
                    <button
                      className="dropdown-item text-success"
                      onClick={() => handleBulkStatus(true)}
                      disabled={!selectedRows.length || bulkLoading || loading}
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      {bulkLoading ? "Processing..." : "Active"}
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleBulkStatus(false)}
                      disabled={!selectedRows.length || bulkLoading || loading}
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      {bulkLoading ? "Processing..." : "Inactive"}
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
            {loading && <div className="text-center py-3">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <PrimeDataTable
                column={columns}
                data={tableData}
                totalRecords={tableData.length}
                rows={rows}
              />
            )}
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
}