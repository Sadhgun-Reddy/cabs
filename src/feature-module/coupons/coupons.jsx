import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import EditCoupons from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";

const Coupons = () => {
  const [_searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(5);
  const [status, setStatus] = useState(true);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  const dataSource = CouponData;
  const columns = [
    {
      header: "Name",
      field: "Name",
    },
    {
      header: "Code",
      field: "Code",
      body: (text) => <span className="badge purple-badge">{text?.Code}</span>,
    },
    // {
    //   header: "Description",
    //   field: "Description",
    // },
    {
      header: "Type",
      field: "Type",
    },
    {
      header: "Discount",
      field: "Discount",
    },
    // {
    //   header: "Limit",
    //   field: "Limit",
    // },
    // {
    //   header: "Valid",
    //   field: "Valid",
    // },

    {
      header: "Status",
      field: "Status",
      body: (text) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="couponStatus"
            checked={status}
            onChange={() => setStatus(!status)}
          />
          <label className="form-check-labe-status ms-2" htmlFor="zoneStatus">
            {status ? "" : ""}
          </label>
        </div>
      ),
    },
    {
      header: "Created At",
      body: (row) =>
        row?.date
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
            })
          : "2026-02-05T15:45:00",
    },
    {
      header: "Actions",
      field: "actions",
      key: "actions",
      body: () => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
            >
              <i className="ti ti-edit" />
            </Link>
            <Link
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
              className="p-2"
              to="#"
            >
              <i className="ti ti-trash" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Coupons</h4>
                <h6>Manage Your Coupons</h6>
              </div>
            </div>
            {/* <TableTopHead /> */}
            <div className="page-btn">
              <Link to="/addcoupons" className="btn btn-primary">
                <i className="ti ti-circle-plus me-1"></i>
                Add Coupons
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="d-flex table-dropdown my-xl-auto left-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    15
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-start p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Fixed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Percentage
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Bulk Actions
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Active
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Inactive
                      </Link>
                    </li>
                  </ul>
                </div>
                <button className="btn btn-outline-success">Apply</button>
              </div>
              <SearchFromApi
                callback={handleSearch}
                rows={rows}
                setRows={setRows}
              />
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={dataSource}
                  totalRecords={10}
                  rows={10}
                  setRows={() => {}}
                  currentPage={1}
                  setCurrentPage={() => {}}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
        <CommonFooter />
      </div>
      <EditCoupons />
      <DeleteModal />
    </div>
  );
};

export default Coupons;
