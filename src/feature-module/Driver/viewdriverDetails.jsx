import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaFileImage, FaFilePdf } from "react-icons/fa";
import { URLS } from "../../url";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";

const ViewDriverDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const driverId = location.state?.driverId;

  // State for driver data
  const [driverData, setDriverData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // Dummy data for ride history and reviews
  const [rideHistory] = useState([]);
  const [reviews] = useState([]);

  // Redirect if no driverId
  useEffect(() => {
    if (!driverId) {
      navigate("/verified-drivers", { replace: true });
    }
  }, [driverId, navigate]);

  // Helper to build full image URL
  const getFullImageUrl = (path) => {
    if (!path) return "";
    // If path already starts with http, return as is
    if (path.startsWith("http")) return path;
    // Otherwise prepend the base URL (adjust as needed)
    return `${URLS.Base}${path}`;
  };

  // Process documents from driverUploads
  const processDocuments = (uploads) => {
    if (!uploads || uploads.length === 0) return [];

    const upload = uploads[0]; // Assuming one upload entry per driver
    const docs = [];

    // Document fields that contain image paths (excluding metadata)
    const docFields = [
      { key: "adharCardFront", label: "Aadhar Front" },
      { key: "adharCardBack", label: "Aadhar Back" },
      { key: "drivingLicenceFront", label: "Driving Licence Front" },
      { key: "drivingLicenceBack", label: "Driving Licence Back" },
      { key: "policyVerify", label: "Policy Verify" },
      { key: "quarterlyTax", label: "Quarterly Tax" },
      { key: "vehicleFitness", label: "Vehicle Fitness" },
      { key: "vehicleInsurance", label: "Vehicle Insurance" },
      { key: "vehiclePollution", label: "Vehicle Pollution" },
      { key: "vehicleRC", label: "Vehicle RC" },
    ];

    // Add single image fields
    docFields.forEach(({ key, label }) => {
      if (upload[key]) {
        docs.push({
          name: label,
          url: getFullImageUrl(upload[key]),
          date: upload.logCreatedDate,
        });
      }
    });

    // Add vehicle images (multiple)
    if (Array.isArray(upload.vehicleImages) && upload.vehicleImages.length > 0) {
      upload.vehicleImages.forEach((imgPath, index) => {
        docs.push({
          name: `Vehicle Image ${index + 1}`,
          url: getFullImageUrl(imgPath),
          date: upload.logCreatedDate,
        });
      });
    }

    return docs;
  };

  // Fetch driver details
  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!driverId) return;
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          URLS.GetDriverById,
          { driverId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.data;
          setDriverData(data);
          setDocuments(processDocuments(data.driverUploads));
        } else {
          setError(response.data.message || "Failed to load driver data");
        }
      } catch (err) {
        console.error("Fetch driver error:", err);
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [driverId]);

  // Columns for Rider History table
  const historyColumns = [
    { header: "Ride Number", field: "ridenumber" },
    { header: "Driver", field: "driver" },
    { header: "Service", field: "service" },
    { header: "Service Category", field: "servicecategory" },
    { header: "Ride Status", field: "" },
    { header: "Total", field: "total" },
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
      body: () => (
        <div className="view-action">
          <Link className="me-2 p-2" to="/rideDetails" title="Ride Details">
            <i className="ti ti-eye text-primary" />
          </Link>
        </div>
      ),
    },
  ];

  // Columns for Rider Reviews table
  const reviewColumns = [
    { header: "Rider", field: "rider" },
    { header: "Rating", field: "rating" },
    { header: "Message", field: "message" },
  ];

  // Helper to render star rating
  const renderRating = () => (
    <div className="text-warning">
      Rating
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className="ms-1" />
      ))}
    </div>
  );

  // Open modal with selected document
  const openDocumentModal = (doc) => {
    setModalTitle(doc.name);
    setModalImageUrl(doc.url);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid p-4 bg-light min-vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  if (error || !driverData) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid p-4 bg-light min-vh-100">
          <div className="alert alert-danger" role="alert">
            {error || "Driver data not found"}
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    emergencyPhone,
    gender,
    wallet = 0,
    kycStatus,
    address,
    vehicleNumber,
    vehicleYear,
    oiltype,
    vehicleModelId,
  } = driverData;

  const showHistoryAndReviews = kycStatus === "verified";

  return (
    <div className="page-wrapper">
      <div className="container-fluid p-4 bg-light min-vh-100">
        {/* ========== TOP SECTION ========== */}
        <div className="row g-4">
          {/* Driver Information */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Driver Information</h5>

                <div
                  className="d-flex align-items-center mb-4"
                  style={{
                    backgroundImage: "url('/src/assets/img/bg-img-000.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    backgroundColor: "#f8f9fa",
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
                    {name?.charAt(0) || "D"}
                  </div>

                  <div>
                    <h5 className="mb-1" style={{ fontSize: "24px" }}>
                      {name || "—"}
                    </h5>
                    {renderRating()}
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <p>
                      <strong>Email :</strong> {email || "—"}
                    </p>
                    <p>
                      <strong>Contact :</strong> {phone || "—"}
                    </p>
                    <p>
                      <strong>Emergency Contact :</strong>{" "}
                      {emergencyPhone || "—"}
                    </p>
                    <p>
                      <strong>Gender :</strong> {gender || "—"}
                    </p>
                  </div>
                  <div className="col-6 border-start">
                    <p>
                      <strong>Total Rides :</strong> 0
                    </p>
                    <p>
                      <strong>Wallet :</strong> {wallet}
                    </p>
                    <p>
                      <strong>Total Earnings :</strong> 0.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Documents */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Driver Documents</h5>
                  {/* <Link to="/driverDocument" className="btn btn-success btn-sm">
                    View All
                  </Link> */}
                </div>

                <div className="table-responsive" style={{ maxHeight: "300px" }}>
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Document</th>
                        <th>Preview</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.length > 0 ? (
                        documents.map((doc, idx) => (
                          <tr key={idx}>
                            <td>{doc.name}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openDocumentModal(doc)}
                                title="Preview"
                              >
                                <FaFileImage />
                              </button>
                            </td>
                            <td>
                              {doc.date
                                ? new Date(doc.date).toLocaleDateString("en-IN")
                                : "--"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-muted py-5">
                            No documents available
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

        {/* ========== RIDER HISTORY (conditional) ========== */}
        {showHistoryAndReviews && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Rider History</h5>
              <PrimeDataTable
                column={historyColumns}
                data={rideHistory}
                totalRecords={rideHistory.length}
                rows={10}
              />
            </div>
          </div>
        )}

        {/* ========== BOTTOM ROW ========== */}
        <div className="row g-4 mt-2">
          {/* Vehicle Information */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Vehicle Information</h5>
                <div className="row">
                  <div className="col-6">
                    <p>
                      <strong>Model :</strong> {vehicleModelId || "—"}
                    </p>
                    <p>
                      <strong>Vehicle Type :</strong> —
                    </p>
                    <p>
                      <strong>Color :</strong> —
                    </p>
                  </div>
                  <div className="col-6 border-start">
                    <p>
                      <strong>Seats :</strong> —
                    </p>
                    <p>
                      <strong>Plate Number :</strong> {vehicleNumber || "—"}
                    </p>
                    <p>
                      <strong>Year :</strong> {vehicleYear || "—"}
                    </p>
                    <p>
                      <strong>Fuel Type :</strong> {oiltype || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Location */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Driver Location</h5>
                </div>
                <div className="table-responsive">
                  <iframe
                    title="Driver Location"
                    className="embed-map-frame"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    width="100%"
                    height={300}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      address || "Hyderabad"
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rider Reviews (conditional) */}
          {showHistoryAndReviews && (
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Rider Reviews</h5>
                    <Link to="#" className="btn btn-success btn-sm">
                      View All
                    </Link>
                  </div>

                  <div className="table-responsive">
                    <PrimeDataTable
                      column={reviewColumns}
                      data={reviews}
                      totalRecords={reviews.length}
                      rows={10}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {showModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  {modalImageUrl ? (
                    <img
                      src={modalImageUrl}
                      alt={modalTitle}
                      className="img-fluid"
                      style={{ maxHeight: "70vh" }}
                    />
                  ) : (
                    <p>Image not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      <CommonFooter />
    </div>
  );
};

export default ViewDriverDetails;