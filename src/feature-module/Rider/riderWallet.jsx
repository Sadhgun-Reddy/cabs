import { useState } from "react";
import { Link, Route } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import AddZones from "../../core/modals/coupons/addcoupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";

export default function Riderwallet() {
  const [_searchQuery, setSearchQuery] = useState(undefined);
  const [rows, setRows] = useState(10);

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
    // {
    //   header: "Status",
    //   field: "Status",
    //   body: (row) => {
    //     const isActive = row?.Status === "Active";

    //     return (
    //       <span
    //         className={`d-inline-flex align-items-center gap-1 cursor-pointer`}
    //         title={isActive ? "Active" : "Inactive"}
    //       >
    //         <i
    //           className={`ti ${
    //             isActive
    //               ? "ti-toggle-right text-success"
    //               : "ti-toggle-left text-danger"
    //           } fs-4`}
    //         ></i>
    //         <span
    //           className={'fw-medium ${isActive ? "text-success" : "text-danger"}'}
    //         >
    //           {isActive ? "Active" : "Inactive"}
    //         </span>
    //       </span>
    //     );
    //   },
    // },
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
              month: "short",
              year: "numeric",
              hour: "2-digit",
            })
          : "2026-02-06 T10:30",
    },
    // {
    //   header: "Actions",
    //   field: "actions",
    //   key: "actions",
    //   body: () => (
    //     <div className="action-table-data">
    //       <div className="edit-delete-action">
    //         <Link
    //           className="me-2 p-2"
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#edit-units"
    //         >
    //           <i className="ti ti-edit" />
    //         </Link>
    //         <Link
    //           data-bs-toggle="modal"
    //           data-bs-target="#delete-modal"
    //           className="p-2"
    //           to="#"
    //         >
    //           <i className="ti ti-trash" />
    //         </Link>
    //       </div>
    //     </div>
    //   ),
    // },
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
                <h4 className="mb-3">Select Rider</h4>

                <select className="form-select mb-2">
                  <option>Select rider</option>
                </select>

                <small className="text-muted">
                  *To add new rider, simply click{" "}
                  <span className="text-success fw-semibold">here</span>
                </small>
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

                  <button className="btn btn-primary"><i className="ti ti-download me-1" />Credit</button>

                  <button className="btn btn-danger"><i className="ti ti-upload me-1" />Debit</button>
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

              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
                <button className="btn btn-outline-success">Search</button>
              </div>
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
