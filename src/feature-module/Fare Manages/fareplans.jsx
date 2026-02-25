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

  // ===================== CLIENT‑SIDE SEARCH =====================
  // (like Zones – filter already fetched data)
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData;
    const lowerSearch = searchTerm.toLowerCase();
    return tableData.filter(
      (item) =>
        item.serviceName?.toLowerCase().includes(lowerSearch) ||
        item.planName?.toLowerCase().includes(lowerSearch)
    );
  }, [tableData, searchTerm]);

  // ===================== FETCH DATA (ONCE) =====================
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

      // Adjust extraction based on your actual API response
      const fairPlans = res.data?.fairPlans || res.data?.data || res.data || [];
      const formattedData = fairPlans.map((plan) => ({
        id: plan._id,
        serviceName: plan.servicecategoryName,
        planName: plan.planName,
        priority: plan.priority,
        status: plan.status, 
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

  // ===================== STATUS UPDATE HELPERS =====================
  // Convert boolean (for internal use) to API string
  const boolToStatus = (bool) => (bool ? "active" : "inactive");

  // Single status update (used by action buttons)
  const updateSingleStatus = async (id, newStatus) => {
    setUpdateLoading(true);
    try {
      await axios.put(
        `${URLS.EditFairPlan}/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Refresh data
      await fetchFairPlans();
    } catch (err) {
      console.error("Single update error:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Bulk status update – expects a boolean (true = active, false = inactive)
  const updateBulkStatus = async (newStatusBool) => {
    if (!selectedRows.length) return;
    setUpdateLoading(true);
    try {
      
      const statusString = boolToStatus(newStatusBool);

      // Call your bulk endpoint – make sure URLS.UpdateFairPlanBulk is defined
      await axios.post(
        URLS.UpdateFairPlanBulk,
        { ids: selectedRows, status: statusString },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchFairPlans();
      setSelectedRows([]);
    } catch (err) {
      console.error("Bulk update error:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
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
          checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
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
      body: (row) => {
        let badgeClass = "bg-warning text-dark";
        if (row.status === "active") badgeClass = "bg-success";
        if (row.status === "inactive") badgeClass = "bg-danger";
        return (
          <span className={`badge ${badgeClass}`}>
            {row.status === "active" ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="edit-delete-action d-flex align-items-center">
          <Link className="me-2 p-2" to={`/editfareplan/${row.id}`} title="Edit">
            <i className="ti ti-edit" />
          </Link>
          <button
            className="btn p-2 text-success"
            title="Set Active"
            onClick={() => updateSingleStatus(row.id, "active")}
            disabled={row.status === "active" || updateLoading}
          >
            <i className="ti ti-check" />
          </button>
          <button
            className="btn p-2 text-danger"
            title="Set Inactive"
            onClick={() => updateSingleStatus(row.id, "inactive")}
            disabled={row.status === "inactive" || updateLoading}
          >
            <i className="ti ti-x" />
          </button>
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
                      <button className="dropdown-item" onClick={() => setRows(num)}>
                        {num}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bulk Actions – now using boolean true/false like Zones */}
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
                      onClick={() => updateBulkStatus(true)} // true = active
                    >
                      Set Active
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => updateBulkStatus(false)} // false = inactive
                    >
                      Set Inactive
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Search Input – client‑side filter */}
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
                data={filteredData}           // use filtered data
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