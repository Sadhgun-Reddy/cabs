import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";
import { debounce } from "../../utils/debounce";


export default function ServiceCategorie() {
  //  STATE
  const [rows, setRows] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState("");


  // Debounced search update
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    []
  );

  // Handle search input change
  const handleSearch = (value) => {
    setSearchQuery(value);
    debouncedSetSearchTerm(value);
  };

  // Handlers

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item,
      ),
    );
  };

  // Row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  // Bulk status update API call
  const handleBulkStatus = async (status) => {
    if (!selectedRows.length) return;

    setBulkLoading(true);
    setError("");

    try {
      const payload = {
        ids: selectedRows,
        status: status ? "active" : "inactive",
      };

      await axios.put(URLS.UpdateServiceCategoryStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Success – refresh the list
      await fetchServiceCategories();
      setSelectedRows([]);
    } catch (err) {
      console.error("Bulk update error:", err);
      setError("Failed to update status for selected items");
    } finally {
      setBulkLoading(false);
    }
  };

  //  FETCH DATA

  const fetchServiceCategories = async (search = "") => {
    setLoading(true);
    setError("");
    try {

      const url = search
        ? `${URLS.GetAllServiceCategories}?searchQuery=${encodeURIComponent(search)}`
        : URLS.GetAllServiceCategories;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const serviceTypes = response.data?.serviceTypes || [];
      const formattedData = serviceTypes.map((item) => ({
        id: item._id,
        name: item.name,
        priority: item.priority,
        Status: item.status === "active",
        date: item.logCreatedDate,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch service categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCategories(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchServiceCategories();
  }, []);

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
          disabled={bulkLoading}
        />
      ),
      body: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
          disabled={bulkLoading || loading}
        />
      ),
    },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Name",
      field: "name",
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
            className={`form-check-input ${row.Status ? "bg-success" : "bg-danger"
              }`}
            checked={row.Status}
            onChange={() => toggleStatus(row.id)}
            disabled={bulkLoading || loading}
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
        <div className="edit-delete-action">
          <Link className="me-2 p-2" to={`/editServices/${row.id}`}>
            <i className="ti ti-edit" />
          </Link>
        </div>
      ),
    },
  ];

  // UI
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between">
          <div>
            <h4>Service Categories</h4>
          </div>
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
                      disabled={!selectedRows.length || bulkLoading}
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
                      disabled={!selectedRows.length || bulkLoading}
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

              {/* Optional Apply button – kept for UI consistency */}
              {/* <button
                className="btn btn-outline-success"
                disabled={!selectedRows.length || bulkLoading}
              >
                Apply
              </button> */}
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
