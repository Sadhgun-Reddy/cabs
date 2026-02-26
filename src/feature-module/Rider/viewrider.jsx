import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import axios from "axios";
import { URLS } from "../../url";

const ViewRiderDetails = () => {
  const { id: riderId } = useParams();

  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reviews and history are not yet available from the API
  const [reviews] = useState([]);
  const [history] = useState([]);
  const rows = 5;

  /* ===================== FETCH RIDER DETAILS ===================== */
  const fetchRiderDetails = async () => {
    if (!riderId) return;
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        URLS.GetRiderById,
        { userId: riderId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setRider(response.data.user);
      } else {
        setError(response.data.message || "Failed to load rider data");
      }
    } catch (err) {
      console.error("Fetch rider error:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderDetails();
  }, [riderId]);

  /* ===================== HISTORY TABLE COLUMNS ===================== */
  const columns = [
    {
      header: "Ride Number",
      field: "rideNumber",
    },
    {
      header: "Driver",
      field: "driverName",
    },
    {
      header: "Service",
      field: "service",
    },
    {
      header: "Service Category",
      field: "serviceCategory",
    },
    {
      header: "Ride Status",
      field: "status",
    },
    {
      header: "Total",
      field: "total",
    },
    {
      header: "Created Date",
      body: (row) =>
        row?.createdAt
          ? new Date(row.createdAt).toLocaleString("en-IN")
          : "--",
    },
    {
      header: "Actions",
      body: (row) => (
        <div className="view-action">
          <Link
            className="me-2 p-2"
            to={`/rideDetails/${row._id}`}
            title="Ride Details"
          >
            <i className="ti ti-eye text-primary" />
          </Link>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid p-4 bg-light min-vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid p-4 bg-light min-vh-100">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid p-4 bg-light min-vh-100">
          <div className="alert alert-warning">No rider data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container-fluid p-4 bg-light min-vh-100">
        {/* ================= TOP SECTION ================= */}
        <div className="row g-4">
          {/* ================= RIDER INFO ================= */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Rider Information</h5>

                <div
                  className="d-flex align-items-center mb-4"
                  style={{
                    background: "#f8f9fa",
                    padding: "23px 29px",
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
                    {rider.name?.charAt(0) || "R"}
                  </div>

                  <div>
                    <h5 className="mb-1" style={{ fontSize: "24px" }}>
                      {rider.name || "—"}
                    </h5>
                    <div className="text-warning">
                      Rating
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="ms-1" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <p>
                      <strong>Email :</strong> {rider.email || "—"}
                    </p>
                    <p>
                      <strong>Contact :</strong> {rider.phone || "—"}
                    </p>
                    <p>
                      <strong>Emergency :</strong> {rider.emergencyPhone || "—"}
                    </p>
                    <p>
                      <strong>Gender :</strong> {rider.gender || "—"}
                    </p>
                  </div>
                  <div className="col-6 border-start">
                    <p>
                      <strong>Total Rides :</strong> 0
                    </p>
                    <p>
                      <strong>Wallet :</strong> ₹{rider.wallet ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DRIVER REVIEWS ================= */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Driver Reviews</h5>

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
                      {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <tr key={index}>
                            <td>{review.driverName}</td>
                            <td>
                              {[...Array(review.rating)].map((_, i) => (
                                <FaStar key={i} className="text-warning" />
                              ))}
                            </td>
                            <td>{review.comment}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-muted py-5">
                            No reviews available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIDER HISTORY ================= */}
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            <h5 className="fw-bold mb-4">Rider History</h5>

            <PrimeDataTable
              column={columns}
              data={history}
              totalRecords={history.length}
              rows={rows}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRiderDetails;