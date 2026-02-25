import { useState, useEffect, useMemo } from "react";
import axios from "axios"; //
import CommonFooter from "../../components/footer/commonFooter";
import PrimeDataTable from "../../components/data-table";
import { URLS } from "../../url";

export default function Riderwallet() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(10);

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
      header: "Type",
      field: "Status",
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
        },
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
        {/* Top Cards (unchanged) */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="mb-3">Search Rider</h4>
                <input
                  className="form-control mb-2"
                  placeholder="Search by Rider Mobile number or Name"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="mb-3">Wallet Balance</h4>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="fw-bold fs-4 text-success">₹ 0.00</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Credit/debit amount"
                    style={{ maxWidth: "200px" }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter note to user"
                    style={{ maxWidth: "260px" }}
                  />
                  <button className="btn btn-primary">
                    <i className="ti ti-download me-1" />
                    Credit
                  </button>
                  <button className="btn btn-danger">
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
              <h4 className="mb-0">Transactions</h4>
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
    </div>
  );
}
