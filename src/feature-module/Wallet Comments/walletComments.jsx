import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function WalletComments() {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals specific for Add/Edit Comment logic locally if desired, or handle through links.
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [commentName, setCommentName] = useState("");
  const [commentStatus, setCommentStatus] = useState("active");

  const [popupMessage, setPopupMessage] = useState({
    show: false,
    text: "",
    type: "success",
  });

  const showPopup = (message, type = "success") => {
    setPopupMessage({ show: true, text: message, type });
    setTimeout(() => {
      setPopupMessage({ show: false, text: "", type: "success" });
    }, 3000);
  };

  /* ===================== FETCH ALL COMMENTS ===================== */
  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        URLS.GetAllWalletComments,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const comments = res.data?.comments || [];
      const formattedData = comments.map((comment) => ({
        id: comment._id,
        name: comment.name,
        Status: comment.status,
        date: comment.logCreatedDate,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch comments error", err);
      showPopup("Failed to load comments", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  /* ===================== ADD / EDIT COMMENT ===================== */
  const handleSaveComment = async (e) => {
    e.preventDefault();
    if (!commentName.trim()) {
      showPopup("Comment name is required", "warning");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: commentName.trim(),
        status: commentStatus,
      };

      let response;
      if (editingComment) {
        // Edit
        response = await axios.put(
          `${URLS.EditWalletComment}${editingComment.id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Add
        response = await axios.post(URLS.AddWalletComment, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data.success) {
        showPopup(response.data.message || "Saved successfully!", "success");
        closeModal();
        fetchComments();
      } else {
        showPopup(response.data.message || "Failed to save comment", "danger");
      }
    } catch (err) {
      console.error("Save error:", err);
      showPopup(
        err.response?.data?.message || err.message || "Save failed",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingComment(null);
    setCommentName("");
    setCommentStatus("active");
    setShowModal(true);
  };

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setCommentName(comment.name);
    setCommentStatus(comment.Status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingComment(null);
    setCommentName("");
  };

  /* ===================== DELETE COMMENT ===================== */
  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${URLS.DeleteWalletComment}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        showPopup(response.data.message || "Deleted successfully!", "success");
        fetchComments();
      } else {
        showPopup(response.data.message || "Failed to delete", "danger");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showPopup(
        err.response?.data?.message || err.message || "Failed to delete",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== STATUS TOGGLE ===================== */
  const toggleStatus = async (comment) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const newStatus = comment.Status === "active" ? "inactive" : "active";

      const payload = {
        name: comment.name,
        status: newStatus,
      };

      // Reuse the edit endpoint for single status toggle
      const response = await axios.put(
        `${URLS.EditWalletComment}${comment.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showPopup("Status updated successfully", "success");
        fetchComments();
      } else {
        showPopup("Failed to update status", "danger");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      showPopup("Failed to change status", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== ROW SELECTION & BULK ACTIONS ===================== */
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? visibleData.map((row) => row.id) : []);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (!selectedRows.length) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        URLS.UpdateBulkWalletCommentStatus,
        {
          ids: selectedRows,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showPopup(response.data.message || "Bulk update successful", "success");
        setSelectedRows([]); // Clear selection
        fetchComments();
      } else {
        showPopup(response.data.message || "Failed to update bulk status", "danger");
      }
    } catch (err) {
      console.error("Bulk update error:", err);
      showPopup(
        err.response?.data?.message || err.message || "Bulk update failed",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== FILTER DATA ===================== */
  const visibleData = tableData
    .filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((item) => ({
      ...item,
      _selected: selectedRows.includes(item.id),
    }));

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      header: (
        <div className="form-check check-tables">
          <input
            className="form-check-input"
            type="checkbox"
            checked={
              visibleData.length > 0 && selectedRows.length === visibleData.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </div>
      ),
      body: (row) => (
        <div className="form-check check-tables">
          <input
            className="form-check-input"
            type="checkbox"
            checked={row._selected}
            onChange={() => handleRowSelect(row.id)}
          />
        </div>
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
      header: "Status",
      body: (row) => (
        <div className="form-check form-switch">
          <input
            className={`form-check-input ${row.Status === "active" ? "bg-success" : "bg-danger"
              }`}
            type="checkbox"
            checked={row.Status === "active"}
            onChange={() => toggleStatus(row)}
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
        <div className="edit-delete-action d-flex align-items-center">
          <Link
            className="me-2 p-2"
            to="#"
            title="Edit"
            onClick={(e) => {
              e.preventDefault();
              openEditModal(row);
            }}
          >
            <i className="ti ti-edit text-primary" />
          </Link>

          <Link
            className="me-2 p-2"
            to="#"
            title="Delete"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteComment(row.id);
            }}
          >
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  /* ===================== JSX ===================== */
  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Popup Message */}
        {popupMessage.show && (
          <div
            className={`alert alert-${popupMessage.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`}
            style={{ zIndex: 9999, minWidth: "250px" }}
            role="alert"
          >
            {popupMessage.text}
            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setPopupMessage({ show: false, text: "", type: "success" })
              }
            />
          </div>
        )}

        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Wallet Comments</h4>
          <button onClick={openAddModal} className="btn btn-outline-success">
            <i className="ti ti-circle-plus me-1" />
            Add Comment
          </button>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap align-items-center">
              {/* Rows */}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {rows}
                </Link>
                <ul className="dropdown-menu">
                  {[10, 20, 30].map((num) => (
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
                <button
                  type="button"
                  className="btn btn-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Bulk Actions
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item text-success"
                      onClick={() => handleBulkStatusUpdate("active")}
                      disabled={!selectedRows.length}
                    >
                      <i className="ti ti-check me-2" />
                      Mark Active
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleBulkStatusUpdate("inactive")}
                      disabled={!selectedRows.length}
                    >
                      <i className="ti ti-x me-2" />
                      Mark Inactive
                    </button>
                  </li>
                </ul>
              </div>

              {loading && (
                <div className="spinner-border spinner-border-sm text-primary ms-3" />
              )}
            </div>

            <SearchFromApi
              rows={rows}
              setRows={setRows}
              callback={(val) => setSearchQuery(val)}
            />
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <PrimeDataTable
                column={columns}
                data={visibleData}
                totalRecords={visibleData.length}
                rows={rows}
              />
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />

      {/* ADD/EDIT MODAL overlay */}
      {showModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingComment ? "Edit Comment" : "Add Comment"}
                  </h5>
                </div>
                <form onSubmit={handleSaveComment}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">
                        Comment Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="E.g., Wallet Debit Adjustment"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label d-block">Status</label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="statusRadio"
                          id="activeStatus"
                          value="active"
                          checked={commentStatus === "active"}
                          onChange={() => setCommentStatus("active")}
                        />
                        <label className="form-check-label" htmlFor="activeStatus">
                          Active
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="statusRadio"
                          id="inactiveStatus"
                          value="inactive"
                          checked={commentStatus === "inactive"}
                          onChange={() => setCommentStatus("inactive")}
                        />
                        <label className="form-check-label" htmlFor="inactiveStatus">
                          Inactive
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
