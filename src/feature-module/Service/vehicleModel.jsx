import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { debounce } from "../../utils/debounce";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function VehicleModel() {
  /* ===================== STATE ===================== */
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

  // ROW SELECTION
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  /* ===================== STATUS ACTIONS (LOCAL - REPLACE WITH API CALLS) ===================== */
  const activeVehicle = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Active" } : item
      )
    );
  };

  const inactiveVehicle = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Inactive" } : item
      )
    );
  };

  // BULK STATUS UPDATE API (adjust endpoint and mapping)
  const handleBulkStatus = async (newStatus) => {
    if (!selectedRows.length) return;

    setBulkLoading(true);
    setError("");

    try {
      const payload = {
        ids: selectedRows,
        status: newStatus, 
      };

      // Replace with your actual bulk update URL
      await axios.put(URLS.UpdateVehicleModelStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchVehicleModel(searchTerm);
      setSelectedRows([]);
    } catch (err) {
      console.error("Bulk update error:", err);
      setError("Failed to update status for selected items");
    } finally {
      setBulkLoading(false);
    }
  };

  /* ===================== FETCH VEHICLE MODELS ===================== */
  const fetchVehicleModel = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const url = search
        ? `${URLS.GetAllVehicleModel}?searchQuery=${encodeURIComponent(search)}`
        : URLS.GetAllVehicleModel;

      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Extract the array of models (adjust based on actual response)
      let vechileModels = res.data?.vechileModels;


      

      const formattedData = vechileModels.map((vehicleModel) => ({
        id: vehicleModel._id,
        groupname: vehicleModel.vehicleGroupName || "—",
        modelname: vehicleModel.name || "—",
        seater: vehicleModel.seater || "—",
        priority: vehicleModel.priority || "—",
        status: vehicleModel.status || "", 
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch vehicle models");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when searchTerm changes
  useEffect(() => {
    fetchVehicleModel(searchTerm);
  }, [searchTerm]);

  // If you want to filter out any status (e.g., "trash"), you can do it here
  const visibleData = tableData.filter(item => item.status !== "trash");

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
      field: "groupname",
    },
    {
      header: "Model Name",
      field: "modelname",
    },
    {
      header: "Seater",
      field: "seater",
    },
    {
      header: "Priority",
      field: "priority",
    },
    {
      header: "Status",
      body: (row) => {
        let badgeClass = "bg-secondary";
        if (row.status === "active") badgeClass = "bg-success";
        if (row.status === "inactive") badgeClass = "bg-danger";

        return (
          <span className={`badge ${badgeClass}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="edit-delete-action d-flex align-items-center">
          {/* Edit */}
          <Link
            className="me-2 p-2"
            to={`/EditVehicleModel/${row.id}`}
            title="Edit"
          >
            <i className="ti ti-edit text-primary" />
          </Link>
        </div>
      ),
    },
  ];

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>List of Vehicle Model</h4>
          <Link to="/addvehicleModel" className="btn btn-outline-success">
            <i className="ti ti-circle-plus me-1" />
            Add New Model
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
                      onClick={() => handleBulkStatus("active")}
                      disabled={!selectedRows.length || bulkLoading}
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <i className="ti ti-check me-2" />
                      Active
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleBulkStatus("inactive")}
                      disabled={!selectedRows.length || bulkLoading}
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <i className="ti ti-x me-2" />
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