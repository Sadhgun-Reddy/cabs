import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { URLS } from "../../url";
import PrimeDataTable from "../../components/data-table"; 

const ViewRiderDetails = () => {
  const { riderId } = useParams();

  // State for rider info
  const [rider, setRider] = useState(null);
  const [loadingRider, setLoadingRider] = useState(true);
  const [errorRider, setErrorRider] = useState("");

  // State for driver reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState("");

  // State for ride history
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState("");

  // Fetch Rider Details
  const fetchRiderDetails = async () => {
    try {
      setLoadingRider(true);
      const res = await axios.post(
        URLS.GetRiderById,
        { userId: riderId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const rider = res.data?.user || [];
      const formattedData = [rider].map((user) => ({
        id: user._id,
        Name: user.name,
        Email: user.email,
        phoneNumber: user.phoneNumber,
        emergencyPhone: user.emergencyPhone,
        Gender: user.gender,
        totalRides: user.totalRides,
        wallet: user.wallet,
        date: user.logCreatedDate,
      }));

      setTableData(formattedData);
    } catch (err) {
      console.error(err);
      setErrorRider("Failed to fetch rider details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderDetails();
  }, []);

  // Fetch driver reviews
  const fetchDriverReviews = async () => {
    try {
      setLoadingReviews(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        URLS.GetDriverReviews,
        { riderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(res.data.reviews || []);
      setErrorReviews("");
    } catch (err) {
      console.error("Reviews fetch error:", err);
      setErrorReviews("Could not load driver reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  // Fetch ride history
  const fetchRiderHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        URLS.GetRiderHistory,
        { riderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data.rides || []);
      setErrorHistory("");
    } catch (err) {
      console.error("History fetch error:", err);
      setErrorHistory("Could not load ride history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (riderId) {
      fetchRiderDetails();
      fetchDriverReviews();
      fetchRiderHistory();
    } else {
      setErrorRider("No rider ID provided.");
      setLoadingRider(false);
      setLoadingReviews(false);
      setLoadingHistory(false);
    }
  }, [riderId]);

  // Helper for avatar initials
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "R");

  // Columns for history table (adjust fields to match your API)
  const historyColumns = [
    { header: "Ride Number", field: "rideNumber" },
    { header: "Driver", field: "driverName" },
    { header: "Service", field: "service" },
    { header: "Service Category", field: "category" },
    { header: "Ride Status", field: "status" },
    { header: "Total", field: "total" },
    {
      header: "Created Date",
      body: (row) =>
        row.date
          ? new Date(row.date).toLocaleDateString("en-IN")
          : "--",
    },
  ];

  // If any section is still loading, show a global spinner (optional)
  const anyLoading = loadingRider || loadingReviews || loadingHistory;

  return (
    <div className="page-wrapper">
      <div className="container-fluid p-4 bg-light min-vh-100">
        {anyLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!anyLoading && (
          <>
            {/* ========== RIDER INFORMATION ========== */}
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-4">Rider Information</h5>

                    {errorRider && (
                      <div className="alert alert-danger">{errorRider}</div>
                    )}

                    {rider && (
                      <>
                        <div
                          className="d-flex align-items-center mb-4 p-4"
                          style={{
                            backgroundImage: "url('/src/assets/img/bg-img-000.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "left",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "70px",
                              height: "70px",
                              background: "linear-gradient(135deg, #e6f4f1, #cdebe3)",
                              fontSize: "28px",
                              color: "#198754",
                              fontWeight: "600",
                            }}
                          >
                            {getInitials(rider.name)}
                          </div>
                          <div>
                            <h5 className="mb-1" style={{ fontSize: "24px" }}>
                              {rider.name || "N/A"}
                            </h5>
                            {/* Rating could be added later */}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Email :</strong> {rider.email || "—"}</p>
                            <p><strong>Contact :</strong> {rider.phone || "—"}</p>
                            <p><strong>Emergency Contact :</strong> {rider.emergencyPhone || "—"}</p>
                            <p><strong>Gender :</strong> {rider.gender || "—"}</p>
                          </div>
                          <div className="col-md-6 border-start">
                            <p><strong>Total Rides :</strong> {rider.totalRides ?? "—"}</p>
                            <p><strong>Wallet :</strong> {rider.wallet ? `₹${rider.wallet}` : "—"}</p>
                            <p><strong>Date of Birth :</strong> {rider.dob || "—"}</p>
                            <p><strong>Address :</strong> {rider.address || "—"}</p>
                          </div>
                        </div>

                        {rider.status === "blocked" && rider.blockedReason && (
                          <div className="mt-3 p-3 bg-light border rounded">
                            <strong>Blocked Reason:</strong> {rider.blockedReason}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ========== DRIVER REVIEWS ========== */}
              <div className="col-lg-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-4">Driver Reviews</h5>

                    {errorReviews && (
                      <div className="alert alert-danger">{errorReviews}</div>
                    )}

                    {!errorReviews && (
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Name</th>
                              <th>Rating</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews.length === 0 ? (
                              <tr>
                                <td colSpan="3" className="text-center text-muted py-4">
                                  No reviews available
                                </td>
                              </tr>
                            ) : (
                              reviews.map((rev, idx) => (
                                <tr key={idx}>
                                  <td>{rev.driverName}</td>
                                  <td>
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={i < rev.rating ? "text-warning" : "text-secondary"}
                                      />
                                    ))}
                                  </td>
                                  <td>{rev.comment}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ========== RIDER HISTORY ========== */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Rider History</h5>

                {errorHistory && (
                  <div className="alert alert-danger">{errorHistory}</div>
                )}

                {!errorHistory && (
                  <PrimeDataTable
                    column={historyColumns}
                    data={history}
                    totalRecords={history.length}
                    rows={5}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewRiderDetails;