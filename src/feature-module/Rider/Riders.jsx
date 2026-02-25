import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";
import axios from "axios";
import SearchFromApi from "../../components/data-table/search";

export default function Riders() {
  // ========== STATE ==========
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state for blocking
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  // ========== HANDLERS ==========
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    return tableData.filter((item) =>
      item.Name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tableData, searchQuery]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  // ========== API CALLS ==========
  const fetchRiders = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetAllRiders,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const riders = res.data?.user || [];
      const formattedData = riders.map((user) => ({
        id: user._id,
        Name: user.name,
        phonenumber: user.phone,
        Email: user.email,
        Status: user.status === "active",
        date: user.logCreatedDate,
      }));

      setTableData(formattedData);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch riders");
    } finally {
      setLoading(false);
    }
  };

  // Update rider status – CORRECTED endpoint and flexible payload
  const updateRiderStatus = async (userId, newStatus, blockedReason = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        URLS.UpdateRiderStatus,
        {
          userId: userId,
          status: newStatus,
          ...(blockedReason && { blockedReason }),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Update success:", response.data);
      await fetchRiders();
    } catch (err) {
      console.error("Status update error:", err);

      if (err.response) {
        setError(
          `Update failed: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`,
        );
      } else if (err.request) {
        setError("No response from server. Check network or CORS.");
      } else {
        setError("Failed to update rider status");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Activate rider (direct)
  const handleActivate = async (id) => {
    try {
      await updateRiderStatus(id, "active");
    } catch (err) {}
  };

  // Block rider (with modal)
  const handleBlockConfirm = async () => {
    if (!selectedRider) return;
    try {
      await updateRiderStatus(selectedRider.id, "blocked", blockReason);
      setShowBlockModal(false);
      setSelectedRider(null);
      setBlockReason("");
    } catch (err) {}
  };

  // Local toggle
  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item,
      ),
    );
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  // ========== COLUMNS ==========
  const columns = [
    // {
    //   header: (
    //     <input
    //       type="checkbox"
    //       checked={
    //         tableData.length > 0 && selectedRows.length === tableData.length
    //       }
    //       onChange={(e) => handleSelectAll(e.target.checked)}
    //     />
    //   ),
    //   body: (row) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedRows.includes(row.id)}
    //       onChange={() => handleRowSelect(row.id)}
    //     />
    //   ),
    // },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Name",
      field: "Name",
    },
    {
      header: "Phone Number",
      field: "phonenumber",
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
          <Link className="me-2 p-2" to="/viewrider" title="View Details">
            <i className="ti ti-eye" />
          </Link>

          {row.Status ? (
            <Link
              to="#"
              className="p-2 text-danger"
              title="Block Rider"
              onClick={(e) => {
                e.preventDefault();
                setSelectedRider({ id: row.id, name: row.Name });
                setBlockReason("");
                setShowBlockModal(true);
              }}
            >
              <i className="ti ti-ban" />
            </Link>
          ) : (
            <Link
              to="#"
              className="p-2 text-success"
              title="Activate Rider"
              onClick={(e) => {
                e.preventDefault();
                handleActivate(row.id);
              }}
            >
              <i className="ti ti-check" />
            </Link>
          )}
        </div>
      ),
    },
  ];

  // ========== JSX ==========
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Riders</h4>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card table-list-card">
            <div className="card-header d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2 flex-wrap">
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
                  data={filteredData}
                  totalRecords={filteredData.length}
                  rows={rows}
                />
              </div>
            </div>
          </div>
        </div>

        <CommonFooter />
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Block Rider</h5>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Rider:</strong> {selectedRider?.name}
                  </p>
                  <div className="mb-3">
                    <label htmlFor="blockReason" className="form-label">
                      Reason for blocking
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="blockReason"
                      className="form-control"
                      rows="3"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowBlockModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleBlockConfirm}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
