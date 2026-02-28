import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import PrimeDataTable from "../../components/data-table";
import { URLS } from "../../url";

export default function Driverwallet() {
  // ==================== STATE ====================
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Driver search / selection
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

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

  // Fetch all drivers matching search term (using query params)
  const fetchDrivers = async (query) => {
    if (!query.trim() || query.trim().length < 2) {
      setDrivers([]);
      return;
    }

    setSearchLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Send search as query parameter and status active in payload
      const response = await axios.post(`${URLS.SearchDrivers}?searchQuery=${query}`, { status: "active" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      let driversArray = [];
      const data = response.data;

      if (Array.isArray(data)) {
        driversArray = data;
      } else if (data?.drivers && Array.isArray(data.drivers)) {
        driversArray = data.drivers;
      } else if (data?.data && Array.isArray(data.data)) {
        driversArray = data.data;
      } else if (data?.users && Array.isArray(data.users)) {
        driversArray = data.users;
      } else if (data?.user && Array.isArray(data.user)) {
        driversArray = data.user;
      } else if (data?.results && Array.isArray(data.results)) {
        driversArray = data.results;
      } else {
        const possibleArray = Object.values(data).find((val) =>
          Array.isArray(val)
        );
        if (possibleArray) driversArray = possibleArray;
      }

      const mappedDrivers = driversArray.map((driver) => {
        return {
          _id: driver.driverId || driver._id || driver.id || driver.userId,
          name:
            driver.name || driver.userName || driver.fullName || driver.displayName,
          phone:
            driver.phone ||
            driver.mobile ||
            driver.phoneNumber ||
            driver.mobileNumber,
          walletAmount:
            driver.walletAmount ?? driver.balance ?? driver.amount ?? driver.wallet ?? 0,
        };
      });

      setDrivers(mappedDrivers);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setDrivers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch wallet transactions (optionally filter by driverId)
  const fetchWalletTransactions = async (driverId = null) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      const payload = {
        status: "",
        date: ""
      };

      const response = await axios.post(URLS.GetDriverWallet, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const wallets = response.data?.wallets || [];
      const formattedData = wallets.map((wallet) => ({
        id: wallet._id,
        drivername: wallet.name || wallet.driverName || (driverId ? selectedDriver?.name : ""),
        Amount: wallet.amount,
        phonenumber: wallet.phone || wallet.driverPhone || (driverId ? selectedDriver?.phone : ""),
        Status: wallet.type || wallet.status,
        date: wallet.logCreatedDate || wallet.date,
        driverId: wallet.driverId || wallet.userId || driverId,
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
    if (!selectedDriver) {
      showPopup("Please select a driver first.", "warning");
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
        URLS.DriverCreditDebit,
        {
          userId: selectedDriver._id,
          note: note.trim(),
          type: type === "credit" ? "added" : "debit",
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

        // Update selected driver's balance if returned in response
        if (response.data.currentWalletBalance !== undefined) {
          setSelectedDriver((prev) => ({
            ...prev,
            walletAmount: response.data.currentWalletBalance,
          }));
        } else if (response.data.data?.newBalance !== undefined) {
          setSelectedDriver((prev) => ({
            ...prev,
            walletAmount: response.data.data.newBalance,
          }));
        }

        // Refresh transactions for this driver
        await fetchWalletTransactions(selectedDriver._id);

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
      fetchDrivers(value);
    }, 300);
    return () => clearTimeout(handler);
  };

  const selectDriver = (driver) => {
    setSelectedDriver({
      _id: driver._id,
      name: driver.name,
      phone: driver.phone,
      walletAmount: driver.walletAmount,
    });
    setSearchTerm(driver.name);
    setShowDropdown(false);
    fetchWalletTransactions(driver._id);
  };

  // Filter transactions for the selected driver
  const filteredTransactions = useMemo(() => {
    if (!selectedDriver) return tableData;
    return tableData.filter((tx) => tx.driverId === selectedDriver._id);
  }, [tableData, selectedDriver]);

  // ==================== COLUMNS ====================
  const columns = [
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Driver Name",
      field: "drivername",
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
      body: (row) => (
        <span className={row.Status === "added" ? "text-success bg-success-light fw-bold px-2 py-1 rounded" : row.Status === "debit" ? "text-danger bg-danger-light fw-bold px-2 py-1 rounded" : "text-warning bg-warning-light fw-bold px-2 py-1 rounded"}>
          {row.Status}
        </span>
      )
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
                <h4 className="mb-3">Search Driver</h4>
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
                      {!searchLoading && drivers.length > 0 && (
                        <ul
                          className="list-group"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {drivers.map((driver) => (
                            <li
                              key={driver._id}
                              className="list-group-item list-group-item-action"
                              onMouseDown={() => selectDriver(driver)}
                            >
                              <strong>{driver.name}</strong> <br />
                              <small>{driver.phone}</small>
                            </li>
                          ))}
                        </ul>
                      )}
                      {!searchLoading &&
                        drivers.length === 0 &&
                        searchTerm.trim().length >= 2 && (
                          <div className="p-2 bg-white border rounded">
                            No drivers found
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
                  {selectedDriver && (
                    <span
                      className="ms-2 text-muted"
                      style={{ fontSize: "1rem" }}
                    >
                      ({selectedDriver.name})
                    </span>
                  )}
                </h4>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="fw-bold fs-4 text-success">
                    ₹ {selectedDriver?.walletAmount || "0.00"}
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Credit/debit amount"
                    style={{ maxWidth: "200px" }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!selectedDriver || processing}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter note to user"
                    style={{ maxWidth: "260px" }}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!selectedDriver || processing}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleTransaction("credit")}
                    disabled={!selectedDriver || processing}
                  >
                    <i className="ti ti-download me-1" />
                    Credit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleTransaction("debit")}
                    disabled={!selectedDriver || processing}
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
                {selectedDriver
                  ? `Transactions - ${selectedDriver.name}`
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
