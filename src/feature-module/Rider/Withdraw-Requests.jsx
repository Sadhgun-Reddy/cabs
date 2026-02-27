import { useState, useEffect, useMemo } from "react";
import Link from "antd/es/typography/Link";
import { message } from "antd"; 
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import PrimeDataTable from "../../components/data-table";
import { URLS } from "../../url";

export default function RiderWithdrawRequest() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(10);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Action loading state (for approve/reject)
  const [actionLoading, setActionLoading] = useState(false);

  // Handler for search input
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter((item) => {
      const nameMatch = item.username?.toLowerCase().includes(query);
      const userPhoneMatch = item.phonenumber?.toLowerCase().includes(query);
      return nameMatch || userPhoneMatch;
    });
  }, [tableData, searchQuery]);

  // API call to update wallet status
  const updateWalletStatus = async (id, status, rejectedReason = "") => {
    setActionLoading(true);
    try {
      const payload = { status };
      if (rejectedReason) payload.rejectedReason = rejectedReason;

      const response = await axios.put(
        `${URLS.UpdateRiderWallet}/${id}`, 
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        message.success(response.data.message || `Withdraw request ${status} successfully`);
        // Refresh the list
        await fetchRiderWallet();
      } else {
        throw new Error(response.data?.message || "Action failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      message.error(err.message || "Failed to update request");
    } finally {
      setActionLoading(false);
    }
  };

  // Approve handler
  const handleVerify = (id) => {
    updateWalletStatus(id, "accepted");
  };

  // Open reject modal
  const openRejectModal = (rider) => {
    setSelectedRider(rider);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Confirm reject
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning("Please provide a reason for rejection");
      return;
    }
    await updateWalletStatus(selectedRider.id, "rejected", rejectReason);
    setShowRejectModal(false);
    setSelectedRider(null);
    setRejectReason("");
  };

  // Define table columns
  const columns = [
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "User Name",
      field: "username",
    },
    {
      header: "Amount",
      body: (row) => `₹${row.Amount?.toFixed(2) || "0.00"}`,
    },
    {
      header: "Phone Number",
      field: "phonenumber",
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
          <button
            className="btn p-2"
            title="Approve"
            onClick={() => handleVerify(row.id)}
            disabled={actionLoading} 
          >
            <i className="ti ti-check text-success" />
          </button>
       
          {row.Status && (
            <Link
              to="#"
              className="p-2"
              title="Reject"
              onClick={(e) => {
                e.preventDefault();
                openRejectModal({ id: row.id, name: row.username });
              }}
            >
              <i className="ti ti-ban text-danger" />
            </Link>
          )}
        </div>
      ),
    },
  ];

  // Fetch wallet data
  const fetchRiderWallet = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        URLS.GetRiderWallet,
        { status: "withdraw" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const wallets = response.data?.wallets || [];
      const formattedData = wallets.map((wallet) => ({
        id: wallet._id,
        username: wallet.userName || "",
        Amount: wallet.amount,
        phonenumber: wallet.userPhone || "",
        Status: wallet.type || wallet.status,
        date: wallet.logCreatedDate || wallet.date,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderWallet();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Transactions Card */}
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Withdraw Requests</h4>
              <div className="d-flex">
                <input
                  className="form-control mb-2"
                  placeholder="Search by Mobile number or Name"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

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

      {/* Reject Modal */}
      {showRejectModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Withdrawal Request</h5>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Rider:</strong> {selectedRider?.name}
                  </p>
                  <div className="mb-3">
                    <label htmlFor="rejectReason" className="form-label">
                      Reason for rejection
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="rejectReason"
                      className="form-control"
                      rows="3"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowRejectModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleRejectConfirm}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Updating..." : "Confirm Reject"}
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