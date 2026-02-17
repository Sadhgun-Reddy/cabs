import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CouponData } from "../../core/json/Coupons";
import PrimeDataTable from "../../components/data-table";

const ViewRiderDetails = () => {
  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status ?? true,
    })),
  );

  const [rows] = useState(5);

  /* ===================== COLUMNS ===================== */
  const columns = [
    {
      header: "Ride Number",
      field: "ridenumber",
    },
    {
      header: "Driver",
      field: "driver",
    },
    {
      header: "Service",
      field: "service",
    },
    {
      header: "Service Category",
      field: "servicecategory",
    },
    {
      header: "Ride Status",
      field: "",
    },
    {
      header: "Total",
      field: "total",
    },
    {
      header: "Created Date",
      body: (row) =>
        row?.date
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
            })
          : "--",
    },
    {
      header: "Actions",
      body: () => (
        <div className="view-action">
          <Link className="me-2 p-2" to="/rideDetails" title="Ride Details">
            <i className="ti ti-eye" />
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
          {/* Personal Information */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Personal Information</h5>

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
                    R
                  </div>

                  <div>
                    <h5 className="mb-1" style={{ fontSize: "24px" }}>
                      Sharath Kumar
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
                      <strong>Contact :</strong> +93 123456789
                    </p>
                    <p>
                      <strong>Email :</strong> rider@example.com
                    </p>
                  </div>
                  <div className="col-6 border-start">
                    <p>
                      <strong>Total Rides :</strong> 0
                    </p>
                    <p>
                      <strong>Wallet :</strong> 0.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Reviews */}
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
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-5">
                          No reviews available
                        </td>
                      </tr>
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
              data={tableData}
              totalRecords={tableData.length}
              rows={rows}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRiderDetails;

// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import { Link } from "react-router";

// const ViewRiderDetails = () => {
//   const [rider, setRider] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [rides, setRides] = useState([]);

//   useEffect(() => {
//     // Simulated API Data
//     const riderData = {
//       id: 1,
//       name: "Madhu Rider",
//       phone: "+91 123456789",
//       email: "rider@example.com",
//       totalRides: "",
//       wallet: "",
//       rating: "",
//     };

//     const reviewData = [
//       {
//         id: "",
//         name: "",
//         rating: "",
//         description: "",
//       },
//       {
//         id: "",
//         name: "",
//         rating: "",
//         description: "",
//       },
//     ];

//     const rideHistory = [
//       {
//         id: 101,
//         driver: "John",
//         service: "Cab",
//         category: "Mini",
//         status: "Completed",
//         amount: 120,
//         createdAt: "14-02-2026",
//       },
//       {
//         id: 102,
//         driver: "Alex",
//         service: "Cab",
//         category: "Sedan",
//         status: "Cancelled",
//         amount: 0,
//         createdAt: "10-02-2026",
//       },
//     ];

//     setRider(riderData);
//     setReviews(reviewData);
//     setRides(rideHistory);
//   }, []);

//   if (!rider) return null;

//   const renderStars = (count) => {
//     return [...Array(5)].map((_, i) =>
//       i < count ? (
//         <FaStar key={i} className="text-warning" />
//       ) : (
//         <FaRegStar key={i} className="text-warning" />
//       )
//     );
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Completed":
//         return "badge bg-success";
//       case "Cancelled":
//         return "badge bg-danger";
//       case "Pending":
//         return "badge bg-warning text-dark";
//       default:
//         return "badge bg-secondary";
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="container-fluid p-4 bg-light min-vh-100">

//         {/* ================= TOP SECTION ================= */}
//         <div className="row g-4">

//           {/* Personal Information */}
//           <div className="col-lg-6">
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body">
//                 <h5 className="fw-bold mb-4">Personal Information</h5>

//                 <div className="d-flex align-items-center mb-4">
//                   <div
//                     className="rounded-circle d-flex align-items-center justify-content-center"
//                     style={{
//                       width: "90px",
//                       height: "90px",
//                       background: "#e6f4f1",
//                       fontSize: "35px",
//                       color: "#198754",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {rider.name.charAt(0)}
//                   </div>

//                   <div className="ms-4">
//                     <h5 className="mb-1">{rider.name}</h5>
//                     <div>
//                       Rating {renderStars(rider.rating)}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-6">
//                     <p><strong>Contact :</strong> {rider.phone}</p>
//                     <p><strong>Email :</strong> {rider.email}</p>
//                   </div>
//                   <div className="col-6 border-start">
//                     <p><strong>Total Rides :</strong> {rider.totalRides}</p>
//                     <p><strong>Wallet :</strong> ₹{rider.wallet}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Reviews */}
//           <div className="col-lg-6">
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body">
//                 <h5 className="fw-bold mb-4">Driver Reviews</h5>

//                 {reviews.length === 0 ? (
//                   <div className="text-center text-muted py-5">
//                     No reviews available
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-bordered align-middle">
//                       <thead className="table-light">
//                         <tr>
//                           <th>Name</th>
//                           <th>Rating</th>
//                           <th>Description</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {reviews.map((review) => (
//                           <tr key={review.id}>
//                             <td>{review.name}</td>
//                             <td>{renderStars(review.rating)}</td>
//                             <td>{review.description}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* ================= RIDE HISTORY ================= */}
//         <div className="card shadow-sm border-0 mt-4">
//           <div className="card-body">
//             <h5 className="fw-bold mb-3">Rider History</h5>

//             <div className="table-responsive">
//               <table className="table table-bordered align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Ride Number</th>
//                     <th>Driver</th>
//                     <th>Service</th>
//                     <th>Category</th>
//                     <th>Status</th>
//                     <th>Amount</th>
//                     <th>Created At</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {rides.length === 0 ? (
//                     <tr>
//                       <td colSpan="8" className="text-center text-muted py-4">
//                         No ride records found
//                       </td>
//                     </tr>
//                   ) : (
//                     rides.map((ride) => (
//                       <tr key={ride.id}>
//                         <td>{ride.id}</td>
//                         <td>{ride.driver}</td>
//                         <td>{ride.service}</td>
//                         <td>{ride.category}</td>
//                         <td>
//                           <span className={getStatusBadge(ride.status)}>
//                             {ride.status}
//                           </span>
//                         </td>
//                         <td>₹{ride.amount}</td>
//                         <td>{ride.createdAt}</td>
//                         <td>
//                           <Link to="#" className="btn btn-sm">
//                             View
//                           </Link>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>

//               </table>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ViewRiderDetails;

// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaStar } from "react-icons/fa";

// const ViewRiderDetails = () => {
//   return (
//     <div className="page-wrapper">
//       <div className="container-fluid p-4 bg-light min-vh-100">

//         {/* ================= TOP SECTION ================= */}
//         <div className="row g-4">

//           {/* Personal Information */}
//           <div className="col-lg-6">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body">
//                 <h5 className="fw-bold mb-4">Personal Information</h5>

//                 {/* Profile Section */}
//                 <div className="d-flex align-items-center mb-4">
//                   <div
//                     className="rounded-circle d-flex align-items-center justify-content-center"
//                     style={{
//                       width: "90px",
//                       height: "90px",
//                       background: "#e8f5f1",
//                       fontSize: "36px",
//                       fontWeight: "600",
//                       color: "#198754",
//                     }}
//                   >
//                     R
//                   </div>

//                   <div className="ms-4">
//                     <h5 className="mb-1">Rider Name</h5>
//                     <div className="text-warning d-flex align-items-center">
//                       <span className="me-2 text-dark">Rating</span>
//                       <FaStar className="me-1" />
//                       <FaStar className="me-1" />
//                       <FaStar className="me-1" />
//                       <FaStar className="me-1" />
//                       <FaStar />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Info Section */}
//                 <div className="row">
//                   <div className="col-md-6">
//                     <p><strong>Contact Number :</strong> +91 9876543210</p>
//                     <p><strong>Email :</strong> rider@example.com</p>

//                   </div>

//                   <div className="col-md-6 border-start">
//                     <p><strong>Total Rides :</strong> 0</p>
//                     <p><strong>Wallet :</strong> ₹0.00</p>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Driver Reviews */}
//           <div className="col-lg-6">
//             <div className="card border-0 shadow-sm h-100">
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
//         <div className="card border-0 shadow-sm mt-4">
//           <div className="card-body">

//             <h5 className="fw-bold mb-4">Rider History</h5>

//             <div className="table-responsive">
//               <table className="table table-bordered align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Ride Number</th>
//                     <th>Driver</th>
//                     <th>Service</th>
//                     <th>Service Category</th>
//                     <th>Ride Status</th>
//                     <th>Total Amount</th>
//                     <th>Created At</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td colSpan="8" className="text-center text-muted py-5">
//                       No ride records found
//                     </td>
//                   </tr>
//                 </tbody>

//               </table>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ViewRiderDetails;
