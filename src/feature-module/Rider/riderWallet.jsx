import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import PrimeDataTable from "../../components/data-table";
import { URLS } from "../../url";

export default function Riderwallet() {
  // ==================== STATE ====================
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Rider search / selection
  const [riders, setRiders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);

  // Credit/Debit form
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  // Popup message
  const [popupMessage, setPopupMessage] = useState({
    show: false,
    text: "",
    type: "success",
  });

  //  HELPERS
  const showPopup = (message, type = "success") => {
    setPopupMessage({ show: true, text: message, type });
    setTimeout(() => {
      setPopupMessage({ show: false, text: "", type: "success" });
    }, 3000);
  };

  // Fetch all riders matching search term (using query params)
  const fetchRiders = async (query) => {
    if (!query.trim() || query.trim().length < 2) {
      setRiders([]);
      return;
    }

    setSearchLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Send search as query parameter
      const response = await axios.post(`${URLS.GetAllRiders}?searchQuery=${query}`, {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      // Try to locate the array of riders
      let ridersArray = [];
      const data = response.data;

      if (Array.isArray(data)) {
        ridersArray = data;
      } else if (data?.riders && Array.isArray(data.riders)) {
        ridersArray = data.riders;
      } else if (data?.data && Array.isArray(data.data)) {
        ridersArray = data.data;
      } else if (data?.users && Array.isArray(data.users)) {
        ridersArray = data.users;
      } else if (data?.user && Array.isArray(data.user)) {
        ridersArray = data.user;
      } else if (data?.results && Array.isArray(data.results)) {
        ridersArray = data.results;
      } else {
        const possibleArray = Object.values(data).find((val) =>
          Array.isArray(val),
        );
        if (possibleArray) ridersArray = possibleArray;
      }

      const mappedRiders = ridersArray.map((rider) => {
        return {
          _id: rider._id || rider.id || rider.userId || rider.driverId,
          name:
            rider.name || rider.userName || rider.fullName || rider.displayName,
          phone:
            rider.phone ||
            rider.mobile ||
            rider.phoneNumber ||
            rider.mobileNumber,
          walletAmount:
            rider.walletAmount ?? rider.balance ?? rider.amount ?? rider.wallet ?? 0,
        };
      });

      setRiders(mappedRiders);
    } catch (err) {
      console.error("Error fetching riders:", err);
      setRiders([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch wallet transactions (optionally filter by userId)
  const fetchWalletTransactions = async (userId = null) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      // If your API supports filtering by userId, include it; otherwise fetch all.
      const payload = userId ? { userId } : {};
      const response = await axios.post(URLS.GetRiderWallet, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const wallets = response.data?.wallets || [];
      const formattedData = wallets.map((wallet) => ({
        id: wallet._id,
        ridername: wallet.userName || "",
        Amount: wallet.amount,
        phonenumber: wallet.userPhone || "",
        Status: wallet.type || wallet.status,
        date: wallet.logCreatedDate || wallet.date,
        userId: wallet.userId,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  // Credit/Debit operation
  const handleTransaction = async (type) => {
    if (!selectedRider) {
      showPopup("Please select a rider first.", "warning");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showPopup("Please enter a valid amount.", "warning");
      return;
    }
    if (!note.trim()) {
      showPopup("Please enter a note.", "warning");
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        URLS.RiderCreditDebit,
        {
          userId: selectedRider._id,
          note: note.trim(),
          type: type === "added" ? "added" : "debit",
          amount: parseFloat(amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success === true) {
        showPopup(
          response.data.message || `Amount ${type === "credit" ? "credited" : "debited"} successfully!`,
          "success",
        );

        // Update selected rider's balance if returned in response
        if (response.data.currentWalletBalance !== undefined) {
          setSelectedRider((prev) => ({
            ...prev,
            walletAmount: response.data.currentWalletBalance,
          }));
        } else if (response.data.data?.newBalance !== undefined) {
          setSelectedRider((prev) => ({
            ...prev,
            walletAmount: response.data.data.newBalance,
          }));
        }

        // Refresh transactions for this rider
        await fetchWalletTransactions(selectedRider._id);

        // Clear form
        setAmount("");
        setNote("");
      } else {
        // Handle explicit failure with message
        showPopup(response.data.message || "Transaction failed", "danger");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Transaction failed. Please try again.";
      showPopup(errorMessage, "danger");
    } finally {
      setProcessing(false);
    }
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchWalletTransactions();
  }, []);

  // ==================== HANDLERS ====================
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    // Debounce API calls to avoid too many requests
    const handler = setTimeout(() => {
      fetchRiders(value);
    }, 300);
    return () => clearTimeout(handler);
  };

  const selectRider = (rider) => {
    setSelectedRider({
      _id: rider._id,
      name: rider.name,
      phone: rider.phone,
      walletAmount: rider.walletAmount,
    });
    setSearchTerm(rider.name);
    setShowDropdown(false);
    fetchWalletTransactions(rider._id);
  };

  // Filter transactions for the selected rider
  const filteredTransactions = useMemo(() => {
    if (!selectedRider) return tableData;
    return tableData.filter((tx) => tx.userId === selectedRider._id);
  }, [tableData, selectedRider]);

  // ==================== COLUMNS ====================
  const columns = [
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Rider Name",
      field: "ridername",
    },
    {
      header: "Phone Number",
      field: "phonenumber",
    },
    {
      header: "Amount",
      body: (row) => `₹${row.Amount?.toFixed(2) || "0.00"}`,
    },
    {
      header: "Type",
      field: "Status",
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
  ];

  // ==================== JSX ====================
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
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

        {/* Top Cards */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="mb-3">Search Rider</h4>
                <div className="position-relative">
                  <input
                    className="form-control"
                    placeholder="Search by name or mobile"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() =>
                      searchTerm.trim().length >= 2 && setShowDropdown(true)
                    }
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                  {showDropdown && (
                    <div
                      className="position-absolute w-100 mt-1"
                      style={{ zIndex: 1000 }}
                    >
                      {searchLoading && (
                        <div className="p-2 bg-white border rounded text-center">
                          <span className="spinner-border spinner-border-sm me-2" />
                          Searching...
                        </div>
                      )}
                      {!searchLoading && riders.length > 0 && (
                        <ul
                          className="list-group"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {riders.map((rider) => (
                            <li
                              key={rider._id}
                              className="list-group-item list-group-item-action"
                              onMouseDown={() => selectRider(rider)}
                            >
                              <strong>{rider.name}</strong> <br />
                              <small>{rider.phone}</small>
                            </li>
                          ))}
                        </ul>
                      )}
                      {!searchLoading &&
                        riders.length === 0 &&
                        searchTerm.trim().length >= 2 && (
                          <div className="p-2 bg-white border rounded">
                            No riders found
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="mb-3">
                  Wallet Balance
                  {selectedRider && (
                    <span
                      className="ms-2 text-muted"
                      style={{ fontSize: "1rem" }}
                    >
                      ({selectedRider.name})
                    </span>
                  )}
                </h4>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="fw-bold fs-4 text-success">
                    ₹ {selectedRider?.walletAmount || "0.00"}
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Credit/debit amount"
                    style={{ maxWidth: "200px" }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!selectedRider || processing}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter note to user"
                    style={{ maxWidth: "260px" }}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!selectedRider || processing}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleTransaction("added")}
                    disabled={!selectedRider || processing}
                  >
                    <i className="ti ti-download me-1" />
                    Credit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleTransaction("debit")}
                    disabled={!selectedRider || processing}
                  >
                    <i className="ti ti-upload me-1" />
                    Debit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                {selectedRider
                  ? `Transactions - ${selectedRider.name}`
                  : "All Transactions"}
              </h4>
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
                  data={filteredTransactions}
                  totalRecords={filteredTransactions.length}
                  rows={10}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
}