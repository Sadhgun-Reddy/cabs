import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { debounce } from "../../../utils/debounce";
import PrimeDataTable from "../../../components/data-table";
import CommonFooter from "../../../components/footer/commonFooter";
import SearchFromApi from "../../../components/data-table/search";
import SettingsSideBar from "../settingssidebar";
import { URLS } from "../../../url";

const GstSettings = () => {
  // STATE
  const [rows, setRows] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal specific state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({ name: "", tax: "", status: "active" });
  const [currentTaxId, setCurrentTaxId] = useState(null);

  // Debounced search
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    []
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    debouncedSetSearchTerm(value);
  };

  const handleRowSelect = (id) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, selected: !row.selected } : row
      )
    );
  };

  const handleSelectAll = (checked) => {
    setTableData((prev) => prev.map((row) => ({ ...row, selected: checked })));
  };

  // FETCH TAXES API
  const fetchTaxes = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const url = search
        ? `${URLS.GetAllTax}?searchQuery=${encodeURIComponent(search)}`
        : URLS.GetAllTax;

      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const taxesList = res.data?.taxes || [];
      const formattedData = taxesList.map((t) => ({
        id: t._id,
        name: t.name,
        tax: t.tax,
        status: t.status,
        Status: t.status === "active",
        date: t.logCreatedDate,
        selected: false,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch taxes");
    } finally {
      setLoading(false);
    }
  };

  // ADD TAX API
  const handleAddTax = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(URLS.AddTax, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data?.success) {
        setShowAddModal(false);
        setFormData({ name: "", tax: "", status: "active" });
        fetchTaxes(searchTerm);
      } else {
        alert(res.data?.message || "Error adding tax");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding tax");
    }
  };

  // EDIT TAX API
  const handleEditTax = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${URLS.EditTax}${currentTaxId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data?.success) {
        setShowEditModal(false);
        setFormData({ name: "", tax: "", status: "active" });
        setCurrentTaxId(null);
        fetchTaxes(searchTerm);
      } else {
        alert(res.data?.message || "Error editing tax");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while editing tax");
    }
  };

  // DELETE TAX API
  const handleDeleteTax = async () => {
    try {
      const res = await axios.delete(`${URLS.DeleteTax}${currentTaxId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data?.success) {
        setShowDeleteModal(false);
        setCurrentTaxId(null);
        fetchTaxes(searchTerm);
      } else {
        alert(res.data?.message || "Error deleting tax");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting tax");
    }
  };

  // SINGLE STATUS TOGGLE
  const toggleStatus = async (id, currentStatus) => {
    // Optimistic UI update
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status, status: !item.Status ? "active" : "inactive" } : item
      )
    );

    try {
      const payload = {
        ids: [id],
        status: currentStatus ? "inactive" : "active",
      };
      await axios.put(URLS.UpdateTaxStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Optionally refetch from server if needed, but optimistic covers it
    } catch (err) {
      console.error("Status update error:", err);
      fetchTaxes(searchTerm); // Rollback on error
    }
  };

  // BULK STATUS UPDATE API
  const handleBulkStatus = async (status) => {
    const selectedIds = tableData.filter((row) => row.selected).map((row) => row.id);
    if (!selectedIds.length) return;
    setBulkLoading(true);
    setError("");

    try {
      const payload = {
        ids: selectedIds,
        status: status ? "active" : "inactive",
      };

      await axios.put(URLS.UpdateTaxStatus, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchTaxes(searchTerm);
    } catch (err) {
      console.error("Bulk update error:", err);
      setError("Failed to update status for selected items");
    } finally {
      setBulkLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes(searchTerm);
  }, [searchTerm]);

  const selectedCount = tableData.filter((row) => row.selected).length;
  const isAllSelected = tableData.length > 0 && selectedCount === tableData.length;

  const columns = [
    {
      header: (
        <label className="checkboxs">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={loading || bulkLoading}
          />
          <span className="checkmarks" />
        </label>
      ),
      body: (row) => (
        <label className="checkboxs">
          <input
            type="checkbox"
            checked={row.selected || false}
            onChange={() => handleRowSelect(row.id)}
            disabled={loading || bulkLoading}
          />
          <span className="checkmarks" />
        </label>
      ),
    },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Tax Name",
      field: "name",
    },
    {
      header: "Tax Percentage",
      field: "tax",
    },
    {
      header: "Status",
      body: (row) => (
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className={`form-check-input ${row.Status ? "bg-success" : "bg-danger"}`}
            checked={row.Status}
            onChange={() => toggleStatus(row.id, row.Status)}
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
          })
          : "--",
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="d-flex align-items-center">
          <Link
            className="me-2 p-2"
            to="#"
            title="Edit"
            onClick={() => {
              setFormData({ name: row.name, tax: row.tax, status: row.status });
              setCurrentTaxId(row.id);
              setShowEditModal(true);
            }}
          >
            <i className="ti ti-edit text-primary fs-18" />
          </Link>
          <Link
            to="#"
            className="me-2 p-2"
            title="Delete"
            onClick={() => {
              setCurrentTaxId(row.id);
              setShowDeleteModal(true);
            }}
          >
            <i className="ti ti-trash text-danger fs-18" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content settings-content">
          <div className="page-header d-flex justify-content-between">
            <div className="page-title">
              <h4 className="fw-bold">Settings</h4>
              <h6>Manage your settings on portal</h6>
            </div>
            <div className="page-btn">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFormData({ name: "", tax: "", status: "active" });
                  setShowAddModal(true);
                }}
              >
                <i className="ti ti-circle-plus me-1" />
                Add New Tax
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="settings-wrapper d-flex">
                <SettingsSideBar />
                <div className="card flex-fill mb-0">
                  <div className="card-header d-flex justify-content-between flex-wrap gap-2">
                    <div className="d-flex gap-2 flex-wrap">
                      <h4 className="fs-18 fw-bold">GST Settings</h4>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
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
                              disabled={!tableData.some(row => row.selected) || bulkLoading || loading}
                              style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
                            >
                              {bulkLoading ? "Processing..." : "Active"}
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleBulkStatus(false)}
                              disabled={!tableData.some(row => row.selected) || bulkLoading || loading}
                              style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
                            >
                              {bulkLoading ? "Processing..." : "Inactive"}
                            </button>
                          </li>
                        </ul>
                      </div>

                      <SearchFromApi
                        callback={handleSearch}
                        rows={rows}
                        setRows={setRows}
                      />
                    </div>
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
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>

      {/* Add Tax Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleAddTax}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Tax</h5>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tax Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tax Percentage <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Tax</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tax Modal */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleEditTax}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Tax</h5>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tax Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tax Percentage <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Tax</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>

              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this tax? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary me-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteTax}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GstSettings;