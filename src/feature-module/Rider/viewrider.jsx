// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaStar } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { CouponData } from "../../core/json/Coupons";
// import PrimeDataTable from "../../components/data-table";
// import { URLS } from "../../url";
// import axios from "axios";

// const ViewRiderDetails = () => {
//   const [tableData, setTableData] = useState(
//     CouponData.map((item) => ({
//       ...item,
//       Status: item.Status ?? true,
//     })),
//   );

//   const [rows] = useState(5);
//   const [loadingRider, setLoadingRider] = useState(false);
//   const [errorRider, setErrorRider] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const riderId = "64b8c9e5f1d2c9a1b2c3d4e"; // Example rider ID, replace with actual ID



//   /* ===================== COLUMNS ===================== */
//   const columns = [
//     {
//       header: "Ride Number",
//       field: "ridenumber",
//     },
//     {
//       header: "Driver",
//       field: "driver",
//     },
//     {
//       header: "Service",
//       field: "service",
//     },
//     {
//       header: "Service Category",
//       field: "servicecategory",
//     },
//     {
//       header: "Ride Status",
//       field: "",
//     },
//     {
//       header: "Total",
//       field: "total",
//     },
//     {
//       header: "Created Date",
//       body: (row) =>
//         row?.date
//           ? new Date(row.date).toLocaleString("en-IN", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//               hour: "2-digit",
//             })
//           : "--",
//     },
//     {
//       header: "Actions",
//       body: () => (
//         <div className="view-action">
//           <Link className="me-2 p-2" to="/rideDetails" title="Ride Details">
//             <i className="ti ti-eye text-primary" />
//           </Link>
//         </div>
//       ),
//     },
//   ];

//     // Fetch Rider Details
//   const fetchRiderDetails = async () => {
//     try {
//       setLoadingRider(true);
//       const res = await axios.post(
//         URLS.GetRiderById,
//         { userId: riderId },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       const rider = res.data?.user || [];
//       const formattedData = [rider].map((user) => ({
//         id: user._id,
//         Name: user.name,
//         Email: user.email,
//         phoneNumber: user.phoneNumber,
//         emergencyPhone: user.emergencyPhone,
//         Gender: user.gender,
//         totalRides: user.totalRides,
//         wallet: user.wallet,
//         date: user.logCreatedDate,
//       }));

//       setTableData(formattedData);
//     } catch (err) {
//       console.error(err);
//       setErrorRider("Failed to fetch rider details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRiderDetails();
//   }, []);

//   return (
//     <div className="page-wrapper">
//       <div className="container-fluid p-4 bg-light min-vh-100">
//         {/* ================= TOP SECTION ================= */}
//         <div className="row g-4">
//           {/* Personal Information */}
//           <div className="col-lg-6">
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body">
//                 <h5 className="fw-bold mb-4">Rider Information</h5>

//                 <div
//                   className="d-flex align-items-center mb-4"
//                   style={{
//                     backgroundImage: "url('/src/assets/img/bg-img-000.png')",
//                     backgroundSize: "cover",
//                     backgroundPosition: "left",
//                     backgroundColor: "#f8f9fa",
//                     padding: "23px 29px",
//                   }}
//                 >
//                   <div
//                     className="rounded-circle d-flex align-items-center justify-content-center me-3"
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       background: "linear-gradient(135deg, #e6f4f1, #cdebe3)",
//                       fontSize: "28px",
//                       color: "#198754",
//                       fontWeight: "600",
//                     }}
//                   >
//                     R
//                   </div>

//                   <div>
//                     <h5 className="mb-1" style={{ fontSize: "24px" }}>
//                       Sharath Kumar
//                     </h5>
//                     <div className="text-warning">
//                       Rating
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar key={i} className="ms-1" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-6">
//                     <p>
//                       <strong>Email :</strong> rider@example.com
//                     </p>
//                     <p>
//                       <strong>Contact :</strong> +93 123456789
//                     </p>
//                     <p>
//                       <strong>Emergancy Contact :</strong> +93 123456788
//                     </p>
//                     <p>
//                       <strong>Gender :</strong> Male
//                     </p>
//                   </div>
//                   <div className="col-6 border-start">
//                     <p>
//                       <strong>Total Rides :</strong> 0
//                     </p>
//                     <p>
//                       <strong>Wallet :</strong> 0.00
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Driver Reviews */}
//           <div className="col-lg-6">
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body">
//                 <h5 className="fw-bold mb-4">Driver Reviews</h5>

//                 <div className="table-responsive">
//                   <table className="table align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Name</th>
//                         <th>Rating</th>
//                         <th>Description</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td colSpan="3" className="text-center text-muted py-5">
//                           No reviews available
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= RIDER HISTORY ================= */}
//         <div className="card shadow-sm border-0 mt-4">
//           <div className="card-body">
//             <h5 className="fw-bold mb-4">Rider History</h5>

//             <PrimeDataTable
//               column={columns}
//               data={tableData}
//               totalRecords={tableData.length}
//               rows={rows}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewRiderDetails;


import { useState, useEffect } from "react";  
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import axios from "axios";
import { URLS } from "../../url";

const ViewRiderDetails = () => {
  const { riderId } = useParams();

  const [rider, setRider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const rows = 5;

  /* ===================== FETCH RIDER DETAILS ===================== */
  const fetchRiderDetails = async () => {
    try {
      setLoading(true);

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

      const user = res.data?.user;

      setRider(user);
      setReviews(res.data?.reviews || []);
      setHistory(res.data?.rideHistory || []);

    } catch (err) {
      console.error("Error fetching rider:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (riderId) {
      fetchRiderDetails();
    }
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

                {rider && (
                  <>
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
                        {rider.name?.charAt(0)}
                      </div>

                      <div>
                        <h5 className="mb-1" style={{ fontSize: "24px" }}>
                          {rider.name}
                        </h5>
                        <div className="text-warning">
                          {[...Array(Math.round(rider.rating || 0))].map((_, i) => (
                            <FaStar key={i} className="ms-1" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <p><strong>Email :</strong> {rider.email}</p>
                        <p><strong>Contact :</strong> {rider.phoneNumber}</p>
                        <p><strong>Emergency :</strong> {rider.emergencyPhone}</p>
                        <p><strong>Gender :</strong> {rider.gender}</p>
                      </div>
                      <div className="col-6 border-start">
                        <p><strong>Total Rides :</strong> {rider.totalRides}</p>
                        <p><strong>Wallet :</strong> ₹{rider.wallet}</p>
                      </div>
                    </div>
                  </>
                )}

                {loading && <p>Loading rider details...</p>}
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