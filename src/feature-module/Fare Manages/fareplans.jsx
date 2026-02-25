import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";
import axios from "axios";

export default function FarePlans() {
  const [rows, setRows] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);

  // ===================== CLIENT-SIDE SEARCH =====================
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData;
    const lowerSearch = searchTerm.toLowerCase();
    return tableData.filter(
      (item) =>
        item.serviceName?.toLowerCase().includes(lowerSearch) ||
        item.planName?.toLowerCase().includes(lowerSearch)
    );
  }, [tableData, searchTerm]);

  // ===================== FETCH DATA =====================
  const fetchFairPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        URLS.GetAllFairPlans,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const fairPlans = res.data?.fairPlans || res.data?.data || res.data || [];
      const formattedData = fairPlans.map((plan) => ({
        id: plan._id,
        serviceCategoryId: plan.serviceCategoryId, // keep for edit
        serviceName: plan.servicecategoryName,
        planName: plan.planName,
        priority: plan.priority,
        status: plan.status, // original status string
        isActive: plan.status === "active",
        createdAt: plan.logCreatedDate || plan.createdAt,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch fare plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFairPlans();
  }, []);

  // Helper to convert boolean to API‑expected string
  const boolToStatus = (bool) => (bool ? "active" : "inactive");

  // ===================== STATUS UPDATE =====================
  const updateFairPlanStatus = async (ids, newStatusBool) => {
    if (!ids.length) return;
    setUpdateLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        URLS.UpdateFairPlanStatus,
        {
          ids,
          status: boolToStatus(newStatusBool),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchFairPlans();
    } catch (err) {
      console.error("Status update failed:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Individual toggle
  const toggleStatus = (id) => {
    const item = tableData.find((item) => item.id === id);
    if (!item) return;
    const newStatus = !item.isActive;
    updateFairPlanStatus([id], newStatus);
  };

  // Bulk actions
  const handleBulkStatus = (statusBool) => {
    if (!selectedRows.length) return;
    updateFairPlanStatus(selectedRows, statusBool);
    setSelectedRows([]);
  };

  // ===================== ROW SELECTION =====================
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? filteredData.map((row) => row.id) : []);
  };

  // ===================== COLUMNS =====================
  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            filteredData.length > 0 &&
            selectedRows.length === filteredData.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
          disabled={loading || updateLoading}
        />
      ),
      body: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
          disabled={loading || updateLoading}
        />
      ),
    },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Service Name",
      body: (row) => row.serviceName,
    },
    {
      header: "Plan Name",
      body: (row) => row.planName,
    },
    {
      header: "Priority",
      body: (row) => row.priority,
    },
    {
      header: "Status",
      body: (row) => (
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className={`form-check-input ${row.isActive ? "bg-success" : "bg-danger"}`}
            checked={row.isActive}
            onChange={() => toggleStatus(row.id)}
            disabled={updateLoading}
          />
        </div>
      ),
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="edit-delete-action d-flex align-items-center">
          <Link
            className="me-2 p-2"
            to={`/editfareplan/${row.id}`}
            state={{ plan: row }} // pass full plan data
            title="Edit"
          >
            <i className="ti ti-edit" />
          </Link>
        </div>
      ),
    },
  ];

  // ===================== JSX =====================
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Fare Plan List</h4>
          <Link to="/addfareplan" className="btn btn-outline-success">
            <i className="ti ti-circle-plus me-1" />
            Add New Plan
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {/* Rows per page dropdown */}
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
                  disabled={!selectedRows.length || updateLoading}
                >
                  Bulk Actions
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item text-success"
                      onClick={() => handleBulkStatus(true)}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleBulkStatus(false)}
                    >
                      Inactive
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Search Input */}
            <div className="search-input">
              <input
                type="text"
                className="form-control"
                placeholder="Search by service or plan name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="card-body">
            {loading && <div className="text-center py-3">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <PrimeDataTable
                column={columns}
                data={filteredData}
                totalRecords={filteredData.length}
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