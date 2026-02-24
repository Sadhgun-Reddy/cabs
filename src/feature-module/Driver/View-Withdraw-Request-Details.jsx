// import { useState } from "react";
// import CommonFooter from "../../components/footer/commonFooter";

// const ViewWithdrawRequestDetails = ({ show, handleClose }) => {
//   const [formData, setFormData] = useState({
//     message: "",
//     amount: "",
//     paymentMethod: "",
//     status: "Pending",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleApprove = () => {
//     console.log("Approved:", formData);
//     handleClose();
//   };

//   const handleReject = () => {
//     console.log("Rejected:", formData);
//     handleClose();
//   };

//   if (!show) return null;

//   return (
//     <div className="modal show fade d-block" tabIndex="-1">
//       <div className="modal-dialog modal-md">
//         <div className="modal-content rounded-4">

//           {/* Header */}
//           <div className="modal-header">
//             <h5 className="modal-title fw-bold">Withdraw Request</h5>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={handleClose}
//             ></button>
//           </div>

//           {/* Body */}
//           <div className="modal-body">

//             {/* Message */}
//             <div className="mb-3">
//               <label className="form-label">Message</label>
//               <textarea
//                 name="message"
//                 className="form-control"
//                 rows="3"
//                 value={formData.message}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Amount */}
//             <div className="mb-3">
//               <label className="form-label">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 className="form-control"
//                 value={formData.amount}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Payment Method */}
//             <div className="mb-3">
//               <label className="form-label">Payment Method</label>
//               <select
//                 name="paymentMethod"
//                 className="form-select"
//                 value={formData.paymentMethod}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Method</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="UPI">UPI</option>
//                 <option value="PayPal">PayPal</option>
//               </select>
//             </div>

//             {/* Status */}
            
//             <div className="mb-3">
//               <label className="form-label">Status</label>
//               <select
//                 name="status"
//                 className="form-select"
//                 value={formData.status}
//                 onChange={handleChange}
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="modal-footer justify-content-end">
//             <button
//               className="btn btn-success"
//               onClick={handleApprove}
//             >
//               Approve
//             </button>
//             <button
//               className="btn btn-danger"
//               onClick={handleReject}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       </div>
//       <CommonFooter />
//     </div>
//   );
// };

// export default ViewWithdrawRequestDetails;




import { useState } from "react";
import CommonFooter from "../../components/footer/commonFooter";

const ViewWithdrawRequestDetails = () => {
  const [formData, setFormData] = useState({
    message: "",
    amount: "",
    paymentMethod: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApprove = () => {
    console.log("Approved:", formData);
    alert("Request Approved");
  };

  const handleReject = () => {
    console.log("Rejected:", formData);
    alert("Request Rejected");
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid py-4" style={{ background: "#f4f6f9" }}>
        <div className="container">

          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Withdraw Request Details</h4>
          </div>

          {/* Card */}
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">

              {/* Message */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              {/* Amount */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Amount</label>
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>

              {/* Payment Method */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Payment Method</label>
                <select
                  name="paymentMethod"
                  className="form-select"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Select Method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Buttons Right Side */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-success px-4"
                  onClick={handleApprove}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default ViewWithdrawRequestDetails;
