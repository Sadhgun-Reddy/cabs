import { useState } from "react";
import { Link, Route } from "react-router-dom";
import { CouponData } from "../../core/json/Coupons";
import CommonFooter from "../../components/footer/commonFooter";

export default function Driverwallet() {
  const [_searchQuery, setSearchQuery] = useState(undefined);
  const [rows, setRows] = useState(5);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  const dataSource = CouponData;
  const columns = [
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Amount",
      field: "Amount",
    },
    {
      header: "Type",
      field: "Type",
    },
    {
      header: "Remark",
      field: "Remark",
    },
    {
      header: "Created Date",

      body: (row) =>
        row?.date
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              // hour: "2-digit",
            })
          : "--",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Top Cards */}
        <div className="row g-4 mb-4">
          {/* Select Rider Card */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="mb-3">Search Driver</h4>

                <input
                  className="form-control mb-2"
                  placeholder="Search by Driver Mobile number or ID"
                />
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
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

              {/* <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
                <button className="btn btn-outline-success">Search</button>
              </div> */}
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Remark</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No Data Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
}

// import { useState, useEffect } from "react";
// import Select from "react-select";
// import CommonFooter from "../../components/footer/commonFooter";

// export default function Driverwallet() {
//   const [drivers, setDrivers] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [amount, setAmount] = useState("");
//   const [remark, setRemark] = useState("");
//   const [transactions, setTransactions] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // -------------------------------
//   // Example Driver Data (Replace with API)
//   // -------------------------------
//   useEffect(() => {
//     const driverData = [
//       { id: 1, name: "Ravi", mobile: "9876543210", balance: 500 },
//       { id: 2, name: "Suresh", mobile: "9123456780", balance: 1200 },
//       { id: 3, name: "Mahesh", mobile: "9988776655", balance: 300 },
//     ];

//     setDrivers(driverData);
//   }, []);

//   // -------------------------------
//   // Handle Driver Select
//   // -------------------------------
//   const handleDriverChange = (selected) => {
//     setSelectedDriver(selected);

//     const driver = drivers.find((d) => d.id === selected.value);

//     if (driver) {
//       setWalletBalance(driver.balance);
//       setTransactions([]); // reset transactions
//     }
//   };

//   // -------------------------------
//   // Credit Function
//   // -------------------------------
//   const handleCredit = () => {
//     if (!amount || !selectedDriver) return;

//     const newBalance = walletBalance + Number(amount);
//     setWalletBalance(newBalance);

//     const newTransaction = {
//       id: Date.now(),
//       amount: amount,
//       type: "Credit",
//       remark: remark,
//       date: new Date(),
//     };

//     setTransactions([newTransaction, ...transactions]);
//     setAmount("");
//     setRemark("");
//   };

//   // -------------------------------
//   // Debit Function
//   // -------------------------------
//   const handleDebit = () => {
//     if (!amount || !selectedDriver) return;

//     if (Number(amount) > walletBalance) {
//       alert("Insufficient Balance");
//       return;
//     }

//     const newBalance = walletBalance - Number(amount);
//     setWalletBalance(newBalance);

//     const newTransaction = {
//       id: Date.now(),
//       amount: amount,
//       type: "Debit",
//       remark: remark,
//       date: new Date(),
//     };

//     setTransactions([newTransaction, ...transactions]);
//     setAmount("");
//     setRemark("");
//   };

//   // -------------------------------
//   // Filter Transactions
//   // -------------------------------
//   const filteredTransactions = transactions.filter((tx) =>
//     tx.remark.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // -------------------------------
//   // Driver Dropdown Options
//   // -------------------------------
//   const driverOptions = drivers.map((driver) => ({
//     value: driver.id,
//     label: `${driver.mobile} (${driver.name})`,
//   }));

//   return (
//     <div className="page-wrapper">
//       <div className="content container-fluid">

//         {/* Top Cards */}
//         <div className="row g-4 mb-4">

//           {/* Select Driver */}
//           <div className="col-lg-4">
//             <div className="card h-100">
//               <div className="card-body">
//                 <h4 className="mb-3">Select Driver</h4>

//                 <Select
//                   options={driverOptions}
//                   placeholder="Search Driver Number"
//                   isSearchable
//                   onChange={handleDriverChange}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Wallet Card */}
//           <div className="col-lg-8">
//             <div className="card h-100">
//               <div className="card-body">
//                 <h4 className="mb-3">Wallet Balance</h4>

//                 <div className="d-flex align-items-center gap-3 flex-wrap">
//                   <div className="fw-bold fs-4 text-success">
//                     ₹ {walletBalance.toFixed(2)}
//                   </div>

//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Enter amount"
//                     style={{ maxWidth: "200px" }}
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                   />

//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter note"
//                     style={{ maxWidth: "260px" }}
//                     value={remark}
//                     onChange={(e) => setRemark(e.target.value)}
//                   />

//                   <button
//                     className="btn btn-primary"
//                     onClick={handleCredit}
//                   >
//                     Credit
//                   </button>

//                   <button
//                     className="btn btn-danger"
//                     onClick={handleDebit}
//                   >
//                     Debit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transactions */}
//         <div className="card">
//           <div className="card-body">

//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h4 className="mb-0">Transactions</h4>

//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search by remark"
//                 style={{ maxWidth: "250px" }}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <div className="table-responsive">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Amount</th>
//                     <th>Type</th>
//                     <th>Remark</th>
//                     <th>Created At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTransactions.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="text-center text-muted">
//                         No Data Found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredTransactions.map((tx) => (
//                       <tr key={tx.id}>
//                         <td>₹ {tx.amount}</td>
//                         <td>
//                           <span
//                             className={
//                               tx.type === "Credit"
//                                 ? "text-success"
//                                 : "text-danger"
//                             }
//                           >
//                             {tx.type}
//                           </span>
//                         </td>
//                         <td>{tx.remark}</td>
//                         <td>
//                           {new Date(tx.date).toLocaleString("en-IN")}
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

//       <CommonFooter />
//     </div>
//   );
// }
